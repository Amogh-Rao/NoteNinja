import { useState } from 'react';
import axios from 'axios';

const GUILD_ID = '1330822819684028487'; // Replace with your Discord Guild ID

const extractName = (note: string): string => {
  const match = note.match(/Name:\s*(\w+\s*\w*)/);
  return match ? match[1] : 'Unknown';
};

const processNotes = (notes: string) => {
  const noteList = notes.split(/(?=Name:)/).filter((note) => note.trim() !== '');
  return noteList.map((note) => ({
    name: extractName(note),
    note,
  }));
};

const getChannels = async (guildId: string) => {
  try {
    const response = await axios.get(`http://localhost:3001/channels/${guildId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching channels:', error);
    return [];
  }
};

const sendMessageToChannel = async (channelId: string, message: string) => {
  try {
    await axios.post(`http://localhost:3001/send-message`, {
      channelId,
      message,
    });
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

const NotesParser = () => {
  const [notes, setNotes] = useState<string>('');
  const [status, setStatus] = useState<string[]>([]);
  const [parsedNotes, setParsedNotes] = useState<{ name: string; note: string }[]>([]);

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(event.target.value);
  };

  const sendNotesToDiscord = async () => {
    if (!notes) {
      setStatus(['Please enter notes!']);
      return;
    }

    setStatus([]); // Clear previous statuses

    const parsed = processNotes(notes);
    setParsedNotes(parsed);

    const channels = await getChannels(GUILD_ID);

    for (const { name, note } of parsed) {
      const channelName = name.toLowerCase().replace(/\s+/g, '-');
      const channel = channels.find((c: any) => c.name === channelName);

      if (channel) {
        await sendMessageToChannel(channel.id, note);
        setStatus((prev) => [...prev, `✅ Sent note for ${name} to #${channelName}`]);
      } else {
        setStatus((prev) => [...prev, `❌ Channel not found for #${channelName}`]);
      }
    }
  };

  return (
    <div className="min-h-screen w-screen bg-CNblack flex justify-center items-center">
      <div className="w-full max-w-4xl">
        <div className="space-y-4">
          <textarea
            className="w-full p-6 bg-CNgray text-CNtan1 border-2 border-CNblue rounded-xl 
                      focus:outline-none focus:ring-4 focus:ring-CNblue/50 resize-none
                      placeholder-CNtan2"
            placeholder={`Paste notes here...`}
            value={notes}
            onChange={handleNotesChange}
            rows={10}
          />
          <button
            className="w-full py-4 bg-CNblue hover:bg-CNgray text-white font-bold rounded-xl
                      transition-all duration-200 transform hover:scale-[1.02]"
            onClick={sendNotesToDiscord}
          >
            Process and Send Notes ⚡
          </button>
        </div>

        {parsedNotes.length > 0 && (
          <div className="bg-CNgray rounded-xl p-6 mt-5 border-2 border-CNblue/30">
            <h2 className="text-2xl font-semibold text-CNblue mb-4">Processed Notes</h2>
            <div className="mb-6 space-y-2">
              {status.map((msg, index) => (
                <div key={index} className="text-CNtan2 text-sm font-mono">
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesParser;
