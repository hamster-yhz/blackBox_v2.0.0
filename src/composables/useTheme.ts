import { ref } from 'vue'

export function useTheme() {
  const isDark = ref(true) // 默认使用暗色主题

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
      isDark.value = true // 如果没有保存的主题，使用暗色主题
    }
    updateTheme()
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
} 