import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD

export default defineConfig(({ mode }) => {
  // 1. Load the env variables based on the current mode (dev/prod)
  const env = loadEnv(mode, process.cwd(), '');
=======
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
>>>>>>> fadd85edaba66373918efe3dffe48cddb0fd7f67

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
<<<<<<< HEAD
          // 2. Use 'env' instead of 'Process.env'
          target: env.VITE_BACKEND_URL, 
=======
          target: env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
>>>>>>> fadd85edaba66373918efe3dffe48cddb0fd7f67
          changeOrigin: true,
          secure: false,
        },
      },
    },
<<<<<<< HEAD
  };
});
=======
  }
})
>>>>>>> fadd85edaba66373918efe3dffe48cddb0fd7f67
