import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import optimizer from 'vite-plugin-optimizer'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8712,
  },
  base: './',
  // 定义输出路径为 dist 目录
  build: {
    outDir: path.resolve(__dirname, '../main/web')
  },
  plugins: [
    vue(),
    vueJsx(),
    optimizer({
      electron: `const { ipcRenderer, remote } = window._electron; export { ipcRenderer, remote };`
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
