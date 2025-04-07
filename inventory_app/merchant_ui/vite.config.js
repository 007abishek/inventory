import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern' // Use Dart Sass (default in newer versions)
      }
    }
  },
  build: {
    outDir: 'dist',
  },
});