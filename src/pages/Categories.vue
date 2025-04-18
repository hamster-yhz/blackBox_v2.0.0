<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="category-title text-3xl font-bold mb-8">分类</h1>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
      <button @click="fetchCategories" class="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors duration-200">
        重试
      </button>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg p-6 cursor-pointer transition-all duration-200 border border-gray-200 dark:border-gray-700"
        @click="navigateToCategory(category.id)"
      >
        <h2 class="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{{ category.name }}</h2>
        <p class="text-gray-600 dark:text-gray-400">{{ category.count }} 篇文章</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories, type Category } from '../api/categories'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme'

const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()
const { isDark } = useTheme()

async function fetchCategories() {
  try {
    loading.value = true
    error.value = null
    categories.value = await getCategories()
  } catch (e) {
    error.value = '加载分类失败'
    console.error('Error fetching categories:', e)
  } finally {
    loading.value = false
  }
}

function navigateToCategory(id: string) {
  router.push(`/categories/${id}`)
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-title {
  color: var(--text-primary);
}

.categories-page {
  padding: 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.category-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  transition: all 0.2s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-color-hover);
}

.category-card h2 {
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.dark .category-card {
  background-color: var(--bg-card);
  border-color: var(--border-color);
}

.dark .category-card:hover {
  border-color: var(--border-color-hover);
}

.dark .category-card h2 {
  color: var(--text-primary);
}

.category-card p {
  margin: 0;
  color: #666;
}

.loading, .error {
  color: var(--text-primary);
}

.retry-button {
  background-color: var(--primary-color);
  color: white;
  transition: background-color 0.2s ease;
}

.retry-button:hover {
  background-color: var(--primary-color-hover);
}
</style> 