<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">文章归档</h1>
    
    <div class="space-y-8">
      <div v-for="(articles, year) in groupedArticles" :key="year" class="bg-white dark:bg-dark p-6 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold mb-4">{{ year }}</h2>
        <ul class="space-y-4">
          <li v-for="article in articles" :key="article.id" class="flex items-center">
            <span class="text-gray-500 w-24">{{ formatDate(article.date) }}</span>
            <router-link :to="'/article/' + article.id" class="text-gray-700 dark:text-gray-300 hover:text-primary">
              {{ article.title }}
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Article } from '@/types'

const articles = ref<Article[]>([
  {
    id: '1',
    title: 'Vue 3 入门指南',
    excerpt: '本文介绍了 Vue 3 的基础知识和核心概念...',
    content: '',
    date: '2024-03-20',
    category: 'frontend',
    tags: ['vue', 'javascript'],
    author: '管理员',
    readingTime: 5
  },
  {
    id: '2',
    title: 'TypeScript 最佳实践',
    excerpt: '分享一些 TypeScript 开发中的实用技巧...',
    content: '',
    date: '2024-03-19',
    category: 'frontend',
    tags: ['typescript', 'javascript'],
    author: '管理员',
    readingTime: 8
  }
])

const groupedArticles = computed(() => {
  const groups: Record<string, Article[]> = {}
  articles.value.forEach(article => {
    const year = new Date(article.date).getFullYear()
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(article)
  })
  return groups
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}
</script> 