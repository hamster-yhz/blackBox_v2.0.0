import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ES module compatible __dirname replacement
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
      allow: ['..', '..']
    }
  },
  build: {
    target: 'esnext',
    // 将 content 目录复制到 dist
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router'],
          'utils': ['@vueuse/core', 'fuse.js'],
          'markdown': ['marked', 'highlight.js', 'gray-matter']
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.md')) {
            return 'content/articles/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // 启用构建分析
    sourcemap: true
  }
})