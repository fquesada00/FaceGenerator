import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        '^\/api\/': {
          target: 'http://127.0.0.1:5000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\//, ''),
        },
      },
    },
    base: process.env.VITE_APP_BASE_PATH,
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true,
        },
      },
      modules: {
        localsConvention: 'camelCase',
      },
    },
  })
}
