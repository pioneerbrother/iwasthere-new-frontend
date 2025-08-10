import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'; // <-- THIS IS THE FIX. It now correctly imports 'App'.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App /> {/* <-- THIS IS THE FIX. It now correctly renders 'App'. */}
    </BrowserRouter>
  </React.StrictMode>
);