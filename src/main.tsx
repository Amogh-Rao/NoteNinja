// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css' // Import the CSS file where Tailwind is set up
import App from './App' // Import the main App component

// Rendering the React app into the root div in your HTML file
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App /> {/* Your main component */}
  </React.StrictMode>
)
