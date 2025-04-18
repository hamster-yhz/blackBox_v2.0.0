<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">文章列表</h1>
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div v-for="article in articles" :key="article.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <router-link :to="`/article/${article.id}`" class="block p-6">
          <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
          <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>{{ article.date }}</span>
            <span class="mx-2">•</span>
            <span>{{ article.readTime }}</span>
          </div>
          <p class="text-gray-600 dark:text-gray-300">{{ article.summary }}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getArticles } from '../api/articles'
import type { Article } from '../utils/markdown'

const articles = ref<Article[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    articles.value = await getArticles()
  } catch (e) {
    error.value = '加载文章失败'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script> 