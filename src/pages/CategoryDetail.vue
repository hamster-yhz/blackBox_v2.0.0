<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    <div v-else>
      <header class="text-center mb-12">
        <h1 class="category-detail-title text-4xl font-bold mb-2">{{ getCategoryName(categoryId) }}</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ articles.length }} 篇文章</p>
      </header>

      <div class="grid gap-8">
        <div 
          v-for="article in articles" 
          :key="article.id" 
          class="article-card bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-200"
        >
          <router-link :to="`/article/${article.id}`" class="block p-6 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200">
            <h2 class="article-title text-xl font-semibold mb-2">
              {{ article.title }}
            </h2>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{{ article.date }}</span>
              <span class="mx-2">•</span>
              <span>{{ article.readTime }}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300">{{ extractSummary(article.content) }}</p>
            <div class="mt-4 flex flex-wrap gap-2" v-if="article.tags && article.tags.length > 0">
              <span 
                v-for="tag in article.tags" 
                :key="tag" 
                class="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {{ tag }}
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticles } from '../api/articles'
import type { Article } from '../utils/markdown'
import { extractSummary } from '../utils/markdown'

const route = useRoute()
const categoryId = computed(() => route.params.id as string)
const articles = ref<Article[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    const allArticles = await getArticles()
    articles.value = allArticles.filter(article => 
      article.categories && Array.isArray(article.categories) && article.categories.includes(categoryId.value)
    )
  } catch (e) {
    error.value = '加载文章失败'
    console.error(e)
  } finally {
    loading.value = false
  }
})

// 获取分类的中文名称
function getCategoryName(id: string): string {
  return id
}
</script>

<style scoped>
.category-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.category-header {
  text-align: center;
  margin-bottom: 3rem;
}

.category-header h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.category-header p {
  color: var(--text-tertiary);
  font-size: 1.1rem;
}

.articles-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.article-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-color-hover);
}

.dark .article-card {
  background-color: var(--bg-card);
  border-color: var(--border-color);
}

.dark .article-card:hover {
  border-color: var(--border-color-hover);
}

.article-link {
  text-decoration: none;
}

h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  transition: color 0.2s ease;
}

h2:hover {
  color: var(--primary-color);
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-summary {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.tag:hover {
  color: var(--primary-color);
}

@media (max-width: 768px) {
  .category-detail {
    padding: 1rem;
  }

  .category-header h1 {
    font-size: 2rem;
  }

  .article-card {
    padding: 1rem;
    margin: 0 -1rem;
    border-radius: 0;
  }

  h2 {
    font-size: 1.25rem;
  }
}

.category-detail-title {
  color: var(--text-primary);
}

.article-title {
  color: var(--text-primary);
  transition: color 0.2s ease;
}

.article-title:hover {
  color: var(--primary-color);
}
</style> 