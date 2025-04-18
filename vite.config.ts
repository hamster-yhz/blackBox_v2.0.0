import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    fs: {
      // 允许访问 content 目录
      allow: ['..']
    }
  },
  build: {
    target: 'esnext',
    // 将 content 目录复制到 dist
    assetsDir: 'content',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.md')) {
            return 'content/articles/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
}) 