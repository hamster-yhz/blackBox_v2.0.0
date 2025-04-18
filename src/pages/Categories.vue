<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">分类</h1>
    
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
      <button @click="fetchCategories" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        重试
      </button>
    </div>

    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
        @click="navigateToCategory(category.id)"
      >
        <h2 class="text-xl font-semibold mb-2">{{ category.name }}</h2>
        <p class="text-gray-500 dark:text-gray-400">{{ category.count }} 篇文章</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories, type Category } from '../api/categories'
import { useRouter } from 'vue-router'

const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

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
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.category-card h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: #333;
}

.category-card p {
  margin: 0;
  color: #666;
}

.loading, .error {
  text-align: center;
  margin-top: 2rem;
  color: #666;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #357abd;
}
</style> 