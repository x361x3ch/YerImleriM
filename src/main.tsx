import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { setupStatusBar } from './services/platform';

// Native'de status bar'ı uygulama temasına göre ayarla.
// Tema rengi ThemeService'ten geleceği için ilk açılışta default ile başlıyoruz,
// App.tsx içinde tema değişince tekrar çağrılıyor.
setupStatusBar('#2F5BEA', false).catch(() => {
  /* web'de sessizce yut */
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
