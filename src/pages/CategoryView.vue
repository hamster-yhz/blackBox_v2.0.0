<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Loading category...</p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500 mb-4">{{ error }}</p>
      <button 
        @click="fetchCategory" 
        class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
      >
        Retry
      </button>
    </div>

    <template v-else>
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">{{ category?.name }}</h1>
        <p class="text-gray-600 dark:text-gray-400">
          {{ category?.count }} articles in this category
        </p>
      </div>
      
      <div v-if="category?.articles.length === 0" class="text-center py-8">
        <p class="text-gray-600">No articles in this category yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="article in category?.articles" 
          :key="article.id" 
          class="bg-white dark:bg-dark p-6 rounded-lg shadow-md"
        >
          <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
          <p class="text-gray-600 dark:text-gray-300 mb-4">{{ article.summary }}</p>
          <div class="flex justify-between items-center">
            <span class="text-sm text-gray-500">{{ formatDate(article.createdAt) }}</span>
            <router-link 
              :to="`/article/${article.id}`" 
              class="text-primary hover:underline"
            >
              阅读更多
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCategoryById, type CategoryDetail } from '../api/categories'

const route = useRoute()
const router = useRouter()
const category = ref<CategoryDetail>()
const loading = ref(true)
const error = ref<string | null>(null)

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

async function fetchCategory() {
  const id = route.params.id as string
  if (!id) {
    router.push('/categories')
    return
  }

  try {
    loading.value = true
    error.value = null
    category.value = await getCategoryById(id)
  } catch (e) {
    error.value = '获取分类信息失败'
    console.error('Error fetching category:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCategory()
})
</script> 