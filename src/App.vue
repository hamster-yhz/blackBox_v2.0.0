<template>
  <div :class="{ 'dark': isDark }" class="app-container">
    <Navbar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import Navbar from './components/NavBar.vue'
import { useTheme } from './composables/useTheme'

const { isDark, initTheme } = useTheme()

onMounted(() => {
  initTheme()
})

// 监听主题变化并同步到 html 元素
watch(isDark, (newValue) => {
  document.documentElement.classList.toggle('dark', newValue)
})
</script>

<style>
@import './styles/variables.css';

.app-container {
  min-height: 100vh;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.main-content {
  padding-top: 4rem;
  min-height: calc(100vh - 4rem);
}

/* 修复图片、视频和画布的溢出问题 */
::view-transition-group(*) {
  overflow: clip;
}

img, video, canvas {
  overflow: clip;
  max-width: 100%;
  height: auto;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s, color 0.3s;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--text-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

/* 暗色模式样式 */
.dark {
  color-scheme: dark;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-content {
    padding-top: 3.5rem;
  }
}
</style> 