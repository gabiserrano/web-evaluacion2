import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    // Redirige /api/... al backend para evitar problemas de CORS
    proxy: { '/api': 'http://localhost:3001' },
  },
});