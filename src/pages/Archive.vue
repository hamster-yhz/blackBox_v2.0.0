<template>
  <div class="archive-container">
    <h1 class="archive-title">文章归档</h1>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载文章中...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadArticles" class="retry-button">重试</button>
    </div>
    
    <div v-else class="archive-content">
      <div v-for="(yearGroup, year) in groupedArticles" :key="year" class="year-group">
        <h2 class="year-title">{{ year }}年</h2>
        <div v-for="(monthGroup, month) in yearGroup" :key="month" class="month-group">
          <h3 class="month-title">{{ month }}月</h3>
          <div class="articles-list">
            <router-link
              v-for="article in monthGroup"
              :key="article.id"
              :to="`/article/${article.id}`"
              class="article-link"
            >
              <span class="article-date">{{ formatDay(article.date) }}</span>
              <span class="article-title">{{ article.title }}</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useArticles } from '../composables/useArticles'

const { articles, loadArticles } = useArticles()
const loading = ref(true)
const error = ref<string | null>(null)

const groupedArticles = computed(() => {
  const groups: Record<string, Record<string, any[]>> = {}
  
  articles.value.forEach(article => {
    const date = new Date(article.date)
    const year = date.getFullYear().toString()
    const month = (date.getMonth() + 1).toString()
    
    if (!groups[year]) {
      groups[year] = {}
    }
    if (!groups[year][month]) {
      groups[year][month] = []
    }
    
    groups[year][month].push(article)
  })
  
  // Sort years in descending order
  const sortedGroups: Record<string, Record<string, any[]>> = {}
  Object.keys(groups)
    .sort((a, b) => Number(b) - Number(a))
    .forEach(year => {
      // Sort months in descending order
      const sortedMonths: Record<string, any[]> = {}
      Object.keys(groups[year])
        .sort((a, b) => Number(b) - Number(a))
        .forEach(month => {
          sortedMonths[month] = groups[year][month]
        })
      sortedGroups[year] = sortedMonths
    })
  
  return sortedGroups
})

function formatDay(dateString: string): string {
  return new Date(dateString).getDate().toString().padStart(2, '0')
}

onMounted(async () => {
  try {
    await loadArticles()
  } catch (e) {
    error.value = '加载文章失败'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.archive-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.archive-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: var(--text-primary);
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-button:hover {
  background: var(--primary-color-dark);
}

.year-group {
  margin-bottom: 3rem;
}

.year-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--border-color);
}

.month-group {
  margin-bottom: 2rem;
}

.month-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
  text-decoration: none;
  color: var(--text-primary);
  transition: all 0.2s;
}

.article-link:hover {
  background: var(--bg-secondary);
}

.article-date {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  min-width: 2rem;
}

.article-title {
  font-size: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .archive-container {
    padding: 1rem;
  }
  
  .archive-title {
    font-size: 1.5rem;
  }
  
  .year-title {
    font-size: 1.25rem;
  }
  
  .month-title {
    font-size: 1.1rem;
  }
}
</style> 