import { useStorage } from '@vueuse/core'
import { computed } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

export const useAuth = () => {
  const token = useStorage('auth_token', '')
  const isAuthenticated = computed(() => !!token.value)

  const login = async (email: string, code: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    })

    if (!response.ok) {
      throw new Error('Login failed')
    }

    const { token: newToken } = await response.json()
    token.value = newToken
  }

  const logout = () => {
    token.value = ''
  }

  return {
    token,
    isAuthenticated,
    login,
    logout
  }
}

export const sendVerificationCode = async (email: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  })

  if (!response.ok) {
    throw new Error('Failed to send verification code')
  }
} 