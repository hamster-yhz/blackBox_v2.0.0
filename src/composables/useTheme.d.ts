import { Ref } from 'vue'

export interface ThemeComposable {
  isDark: Ref<boolean>
  toggleTheme: () => void
  initTheme: () => void
}

export function useTheme(): ThemeComposable 