<template>
  <div class="category-list">
    <h2 class="section-title">Categories</h2>
    
    <div v-if="loading" class="loading">
      Loading categories...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchCategories" class="retry-button">Retry</button>
    </div>

    <div v-else class="categories">
      <router-link
        v-for="category in categories"
        :key="category.id"
        :to="`/category/${category.id}`"
        class="category-item"
      >
        <div class="category-info">
          <h3>{{ category.name }}</h3>
          <span class="article-count">{{ category.count }} articles</span>
        </div>
        <div class="arrow">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories, type Category } from '../api/categories'

const categories = ref<Category[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

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

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
.category-list {
  background-color: #fff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.categories {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-radius: 6px;
  background-color: #f8f9fa;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
}

.category-item:hover {
  background-color: #f0f2f5;
  transform: translateX(4px);
}

.category-info h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.article-count {
  font-size: 0.9rem;
  color: #666;
}

.arrow {
  color: var(--primary-color);
  opacity: 0.7;
  transition: opacity 0.2s;
}

.category-item:hover .arrow {
  opacity: 1;
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  color: #666;
}

.retry-button {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #0096e0;
}

@media (max-width: 640px) {
  .category-list {
    padding: 1rem;
  }

  .category-item {
    padding: 0.75rem;
  }
}
</style> 