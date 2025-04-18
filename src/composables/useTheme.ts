import { ref } from 'vue'

// 创建一个共享的状态
const isDark = ref(true) // 默认使用暗色主题

export function useTheme() {
  // 切换主题
  function toggleTheme() {
    isDark.value = !isDark.value
    updateTheme()
  }

  // 更新主题
  function updateTheme() {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // 初始化主题
  function initTheme() {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      // 检查系统主题偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
    updateTheme()
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
} 