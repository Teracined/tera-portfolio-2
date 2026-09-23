import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    watch: {
      // 忽略编辑器 / 工具链写文件时产生的临时目录，避免 FSWatcher EBUSY 崩溃
      ignored: ['**/.*.tmpdir/**', '**/*.tmp', '**/.devlog', '**/dev-server.log'],
    },
  },
})
