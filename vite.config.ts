import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          terms: path.resolve(__dirname, 'terms/index.html'),
          privacy: path.resolve(__dirname, 'privacy/index.html'),
          destinations: path.resolve(__dirname, 'destinations/index.html'),
          packages: path.resolve(__dirname, 'packages/index.html'),
          booking: path.resolve(__dirname, 'booking/index.html'),
          'bookings-hub': path.resolve(__dirname, 'bookings-hub/index.html'),
          conservation: path.resolve(__dirname, 'conservation/index.html'),
          admin: path.resolve(__dirname, 'admin/index.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
// Triggering git sync tracking

