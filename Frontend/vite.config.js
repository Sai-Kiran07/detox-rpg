import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'detox-7qvm4y3yv-tejas-9f5b.vercel.app',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
