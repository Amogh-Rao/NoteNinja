import { useState } from 'react';

interface PasswordPageProps {
  onAuthenticate: () => void;
}

const centerPasswords: { [key: string]: string } = {
  Cupertino: 'cupertino123',
  Sunnyvale: 'sunnyvale123',
};

const PasswordPage = ({ onAuthenticate }: PasswordPageProps) => {
  const [center, setCenter] = useState<string>('Cupertino');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    if (centerPasswords[center] === password) {
      onAuthenticate();
    } else {
      setError('Invalid password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-screen bg-black flex flex-col justify-start items-center py-20">
      <h1 className="text-5xl font-bold text-CNblue mb-12 animate-fadeIn">Center Login</h1>

      <div className="space-y-6 w-full max-w-md">
        <select
          className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-CNblue/50"
          value={center}
          onChange={(e) => setCenter(e.target.value)}
        >
          {Object.keys(centerPasswords).map((centerName) => (
            <option key={centerName} value={centerName}>
              {centerName}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 text-white text-lg focus:outline-none focus:ring-4 focus:ring-CNblue/50"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 bg-CNblue text-white text-lg font-bold rounded-xl transform transition-all duration-200 hover:scale-105 hover:bg-CNblue/90 focus:ring-4 focus:ring-CNblue/50"
        >
          Login
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default PasswordPage;
