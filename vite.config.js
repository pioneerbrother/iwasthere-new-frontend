import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // We need Node's path module

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- THIS IS THE FINAL FIX ---
  // We are creating a "path alias".
  // The '@' symbol will now be a shortcut for our 'src' directory.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
