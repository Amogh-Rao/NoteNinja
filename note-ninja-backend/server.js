const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env
require('dotenv').config({ path: './note-ninja-backend/.env' });

const app = express();
const port = 3001;

if (!process.env.DISCORD_BOT_TOKEN) {
  console.error('❌ Bot Token is undefined! Check your .env file.');
  process.exit(1);
}

const DISCORD_API_URL = 'https://discord.com/api/v10';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

app.use(cors());
app.use(express.json());

// Get list of channels from a guild
app.get('/channels/:guildId', async (req, res) => {
  const guildId = req.params.guildId;

  try {
    const response = await axios.get(`${DISCORD_API_URL}/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching channels from Discord:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
  }
});

// Send message to a specific channel
app.post('/send-message', async (req, res) => {
  const { channelId, message } = req.body;

  if (!channelId || !message) {
    return res.status(400).json({ error: 'Channel ID and message are required' });
  }

  try {
    await axios.post(
      `${DISCORD_API_URL}/channels/${channelId}/messages`,
      { content: message },
      {
        headers: {
          Authorization: `Bot ${BOT_TOKEN}`,
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: error.response?.data || 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
