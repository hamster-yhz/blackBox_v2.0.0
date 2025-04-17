<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">标签: {{ tag?.name }}</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="article in articles" :key="article.id" class="bg-white dark:bg-dark p-6 rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4">{{ article.excerpt }}</p>
        <div class="flex justify-between items-center">
          <span class="text-sm text-gray-500">{{ article.date }}</span>
          <router-link :to="'/article/' + article.id" class="text-primary hover:underline">阅读更多</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Article, Tag } from '@/types'

const route = useRoute()
const tag = ref<Tag>()
const articles = ref<Article[]>([])

onMounted(() => {
  // 模拟从API获取数据
  tag.value = {
    id: route.params.id as string,
    name: 'Vue',
    count: 2
  }

  articles.value = [
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
    }
  ]
})
</script> 