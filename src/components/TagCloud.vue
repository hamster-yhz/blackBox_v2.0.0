<template>
  <div class="tag-cloud">
    <h2 class="section-title">Popular Tags</h2>
    
    <div v-if="loading" class="loading">
      Loading tags...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
      <button @click="fetchTags" class="retry-button">Retry</button>
    </div>

    <div v-else class="tags">
      <router-link
        v-for="tag in tags"
        :key="tag.id"
        :to="`/tag/${tag.id}`"
        class="tag-item"
        :style="{ fontSize: calculateFontSize(tag.count) }"
      >
        #{{ tag.name }}
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getTags, type Tag } from '../api/tags'

const tags = ref<Tag[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchTags() {
  try {
    loading.value = true
    error.value = null
    tags.value = await getTags()
  } catch (e) {
    error.value = 'Failed to load tags'
    console.error('Error fetching tags:', e)
  } finally {
    loading.value = false
  }
}

function calculateFontSize(count: number): string {
  const minCount = 1
  const maxCount = Math.max(...tags.value.map(tag => tag.count))
  const minSize = 0.8
  const maxSize = 1.4
  
  if (maxCount === minCount) return `${minSize}rem`
  
  const size = minSize + (count - minCount) * (maxSize - minSize) / (maxCount - minCount)
  return `${size}rem`
}

onMounted(() => {
  fetchTags()
})
</script>

<style scoped>
.tag-cloud {
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

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-item {
  color: var(--primary-color);
  text-decoration: none;
  transition: all 0.2s;
}

.tag-item:hover {
  color: #0096e0;
  transform: translateY(-1px);
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
  .tag-cloud {
    padding: 1rem;
  }
  
  .tags {
    gap: 0.5rem;
  }
}
</style> 