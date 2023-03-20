import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const apiProxyPathRegex = '^' + process.env.VITE_APP_BASE_PATH.replace('/', '\/').slice(0, -1) + '\/api\/';

  return defineConfig({
    plugins: [react(), tsconfigPaths()],
    server: {
      proxy: {
        [apiProxyPathRegex]: {
          target: process.env.VITE_API_URL,
          changeOrigin: true,
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
