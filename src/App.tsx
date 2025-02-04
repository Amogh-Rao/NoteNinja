import { useState } from 'react';
import NoteParser from "./components/NotesParser";
import PasswordPage from "./components/PasswordPage";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  const handleAuthentication = () => {
    setAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-black">
      {!authenticated ? (
        <PasswordPage onAuthenticate={handleAuthentication} />
      ) : (
        <div className="mx-auto px-4 py-8">
          <h1 className="font-bold text-center text-CNblue">
            NoteNinja
          </h1>
          <NoteParser />
        </div>
      )}
    </div>
  );
}

export default App;
