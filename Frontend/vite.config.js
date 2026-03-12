import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


export default defineConfig(({ mode }) => {
  // 1. Load the env variables based on the current mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    assetsInclude: ['**/*.svg', '**/*.csv'],
    server: {
      proxy: {
        '/api': {
          // 2. Use 'env' instead of 'Process.env'
          target: env.VITE_BACKEND_URL, 
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});