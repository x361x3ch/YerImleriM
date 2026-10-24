/// <reference types="@capacitor/cli" />

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yerimlerim.app',
  appName: 'Yer İmleri M',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#2F5BEA',
      overlaysWebView: false,
    },
    Browser: {
      presentationStyle: 'fullscreen',
    },
  },
};

export default config;
