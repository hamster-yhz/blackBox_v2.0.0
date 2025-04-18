<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          登录黑盒博客
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          请输入您的邮箱地址，我们将发送验证码到您的邮箱
        </p>
      </div>

      <!-- 提示消息 -->
      <div v-if="message" :class="['rounded-md p-4', messageType === 'success' ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900']">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg v-if="messageType === 'success'" class="h-5 w-5 text-green-400 dark:text-green-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-5 w-5 text-red-400 dark:text-red-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p :class="['text-sm font-medium', messageType === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200']">
              {{ message }}
            </p>
          </div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">邮箱地址</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
              placeholder="邮箱地址"
            />
          </div>
          <div class="mt-4">
            <label for="code" class="sr-only">验证码</label>
            <div class="flex gap-2">
              <input
                id="code"
                v-model="code"
                name="code"
                type="text"
                required
                class="appearance-none rounded-md relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white dark:bg-gray-800 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-base"
                placeholder="验证码"
              />
              <button
                type="button"
                @click="sendCode"
                :disabled="isSending"
                class="px-4 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {{ isSending ? '发送中...' : '获取验证码' }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoggingIn"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isLoggingIn ? '登录中...' : '登录' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth, sendVerificationCode } from '../api/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const code = ref('')
const isSending = ref(false)
const isLoggingIn = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 5000)
}

const sendCode = async () => {
  if (!email.value) {
    showMessage('请输入邮箱地址', 'error')
    return
  }

  isSending.value = true
  try {
    await sendVerificationCode(email.value)
    showMessage('验证码已发送到您的邮箱，请查收')
  } catch (error) {
    showMessage('发送验证码失败，请稍后重试', 'error')
  } finally {
    isSending.value = false
  }
}

const handleLogin = async () => {
  if (!email.value || !code.value) {
    showMessage('请输入邮箱和验证码', 'error')
    return
  }

  isLoggingIn.value = true
  try {
    await login(email.value, code.value)
    showMessage('登录成功，正在跳转...')
    setTimeout(() => {
      router.push('/')
    }, 1000)
  } catch (error) {
    showMessage('验证码错误或已过期，请重新获取', 'error')
  } finally {
    isLoggingIn.value = false
  }
}
</script> 