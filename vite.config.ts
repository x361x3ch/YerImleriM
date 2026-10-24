import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Capacitor'ın Android WebView'ı file:// protokolü ile yükler.
// Bu yüzden asset yolları relative (./) olmalı, absolute (/) değil.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    target: 'es2020',
  },
});
