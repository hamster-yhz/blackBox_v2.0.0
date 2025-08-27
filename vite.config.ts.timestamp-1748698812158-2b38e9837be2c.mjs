// vite.config.ts
import { defineConfig } from "file:///D:/warehouse/blackBox/blackBox_v2.0.0/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/warehouse/blackBox/blackBox_v2.0.0/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import { resolve } from "path";
var __vite_injected_original_dirname = "D:\\warehouse\\blackBox\\blackBox_v2.0.0";
var vite_config_default = defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src")
    }
  },
  server: {
    fs: {
      // 允许访问 content 目录
      allow: [".."]
    }
  },
  build: {
    target: "esnext",
    // 将 content 目录复制到 dist
    assetsDir: "content",
    rollupOptions: {
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      },
      output: {
        manualChunks: {
          "vendor": ["vue", "vue-router"],
          "utils": ["@vueuse/core", "fuse.js"],
          "markdown": ["marked", "highlight.js", "gray-matter"]
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".md")) {
            return "content/articles/[name][extname]";
          }
          return "assets/[name]-[hash][extname]";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js"
      }
    },
    // 启用构建分析
    sourcemap: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx3YXJlaG91c2VcXFxcYmxhY2tCb3hcXFxcYmxhY2tCb3hfdjIuMC4wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx3YXJlaG91c2VcXFxcYmxhY2tCb3hcXFxcYmxhY2tCb3hfdjIuMC4wXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93YXJlaG91c2UvYmxhY2tCb3gvYmxhY2tCb3hfdjIuMC4wL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJ1xuaW1wb3J0IHsgcmVzb2x2ZSB9IGZyb20gJ3BhdGgnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbdnVlKCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKVxuICAgIH1cbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgZnM6IHtcbiAgICAgIC8vIFx1NTE0MVx1OEJCOFx1OEJCRlx1OTVFRSBjb250ZW50IFx1NzZFRVx1NUY1NVxuICAgICAgYWxsb3c6IFsnLi4nXVxuICAgIH1cbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICB0YXJnZXQ6ICdlc25leHQnLFxuICAgIC8vIFx1NUMwNiBjb250ZW50IFx1NzZFRVx1NUY1NVx1NTkwRFx1NTIzNlx1NTIzMCBkaXN0XG4gICAgYXNzZXRzRGlyOiAnY29udGVudCcsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgaW5wdXQ6IHtcbiAgICAgICAgbWFpbjogcmVzb2x2ZShfX2Rpcm5hbWUsICdpbmRleC5odG1sJylcbiAgICAgIH0sXG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3ZlbmRvcic6IFsndnVlJywgJ3Z1ZS1yb3V0ZXInXSxcbiAgICAgICAgICAndXRpbHMnOiBbJ0B2dWV1c2UvY29yZScsICdmdXNlLmpzJ10sXG4gICAgICAgICAgJ21hcmtkb3duJzogWydtYXJrZWQnLCAnaGlnaGxpZ2h0LmpzJywgJ2dyYXktbWF0dGVyJ11cbiAgICAgICAgfSxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6IChhc3NldEluZm8pID0+IHtcbiAgICAgICAgICBpZiAoYXNzZXRJbmZvLm5hbWU/LmVuZHNXaXRoKCcubWQnKSkge1xuICAgICAgICAgICAgcmV0dXJuICdjb250ZW50L2FydGljbGVzL1tuYW1lXVtleHRuYW1lXSdcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuICdhc3NldHMvW25hbWVdLVtoYXNoXVtleHRuYW1lXSdcbiAgICAgICAgfSxcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6ICdhc3NldHMvW25hbWVdLVtoYXNoXS5qcycsXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnYXNzZXRzL1tuYW1lXS1baGFzaF0uanMnXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBcdTU0MkZcdTc1MjhcdTY3ODRcdTVFRkFcdTUyMDZcdTY3OTBcbiAgICBzb3VyY2VtYXA6IHRydWVcbiAgfVxufSkgIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5UyxTQUFTLG9CQUFvQjtBQUN0VSxPQUFPLFNBQVM7QUFDaEIsU0FBUyxlQUFlO0FBRnhCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFBQSxFQUNmLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDL0I7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixJQUFJO0FBQUE7QUFBQSxNQUVGLE9BQU8sQ0FBQyxJQUFJO0FBQUEsSUFDZDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLElBRVIsV0FBVztBQUFBLElBQ1gsZUFBZTtBQUFBLE1BQ2IsT0FBTztBQUFBLFFBQ0wsTUFBTSxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUN2QztBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osVUFBVSxDQUFDLE9BQU8sWUFBWTtBQUFBLFVBQzlCLFNBQVMsQ0FBQyxnQkFBZ0IsU0FBUztBQUFBLFVBQ25DLFlBQVksQ0FBQyxVQUFVLGdCQUFnQixhQUFhO0FBQUEsUUFDdEQ7QUFBQSxRQUNBLGdCQUFnQixDQUFDLGNBQWM7QUFDN0IsY0FBSSxVQUFVLE1BQU0sU0FBUyxLQUFLLEdBQUc7QUFDbkMsbUJBQU87QUFBQSxVQUNUO0FBQ0EsaUJBQU87QUFBQSxRQUNUO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxNQUNsQjtBQUFBLElBQ0Y7QUFBQTtBQUFBLElBRUEsV0FBVztBQUFBLEVBQ2I7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
