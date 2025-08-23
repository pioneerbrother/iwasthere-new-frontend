// File: iwasthere/new-frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Web3Provider } from './contexts/Web3Provider.jsx'; // This is required for payments

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Web3Provider>
      {/* App already contains the BrowserRouter */}
      <App />
    </Web3Provider>
  </React.StrictMode>,
);