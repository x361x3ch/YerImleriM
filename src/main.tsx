import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupStatusBar } from './services/platform';

// Native'de status bar'ı uygulama temasına göre ayarla.
// Web'de sessizce no-op.
setupStatusBar('#2F5BEA', false).catch(() => {});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
