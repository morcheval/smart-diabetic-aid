import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.dianutri.ai',
  appName: 'DiaNutri AI',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
