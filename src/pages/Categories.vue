<template>
  <div class="categories-page">
    <h1>Categories</h1>
    
    <div v-if="loading" class="loading">
      Loading categories...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchCategories" class="retry-button">Retry</button>
    </div>

    <div v-else class="categories-grid">
      <div
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        @click="navigateToCategory(category.id)"
      >
        <h2>{{ category.name }}</h2>
        <p>{{ category.count }} articles</p>
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
    error.value = 'Failed to load categories'
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