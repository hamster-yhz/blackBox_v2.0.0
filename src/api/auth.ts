import { useStorage } from '@vueuse/core'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

export const useAuth = () => {
  const token = useStorage('auth_token', '')
  const isAuthenticated = computed(() => !!token.value)

  return {
    token,
    isAuthenticated
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

export const login = async (email: string, code: string) => {
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

  const { token } = await response.json()
  const { token: authToken } = useAuth()
  authToken.value = token
}

export const logout = () => {
  const { token } = useAuth()
  token.value = ''
} 