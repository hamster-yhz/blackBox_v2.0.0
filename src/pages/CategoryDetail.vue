<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
    </div>
    <div v-else-if="error" class="text-red-500 text-center py-8">
      {{ error }}
    </div>
    <div v-else>
      <header class="text-center mb-12">
        <h1 class="text-4xl font-bold mb-2">{{ getCategoryName(categoryId) }}</h1>
        <p class="text-gray-500 dark:text-gray-400">{{ articles.length }} 篇文章</p>
      </header>

      <div class="grid gap-8">
        <div v-for="article in articles" :key="article.id" class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <router-link :to="`/article/${article.id}`" class="block p-6">
            <h2 class="text-xl font-semibold mb-2">{{ article.title }}</h2>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span>{{ article.date }}</span>
              <span class="mx-2">•</span>
              <span>{{ article.readTime }}</span>
            </div>
            <p class="text-gray-600 dark:text-gray-300">{{ extractSummary(article.content) }}</p>
            <div class="mt-4 flex gap-2">
              <span v-for="tag in article.tags" :key="tag" class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
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
    articles.value = allArticles.filter(article => article.category === categoryId.value)
  } catch (e) {
    error.value = '加载文章失败'
    console.error(e)
  } finally {
    loading.value = false
  }
})

// 获取分类的中文名称
function getCategoryName(id: string): string {
  const categoryNames: Record<string, string> = {
    'frontend': '前端开发',
    'backend': '后端开发',
    'devops': 'DevOps',
    'algorithm': '算法'
  }
  return categoryNames[id] || id
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
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.article-link {
  text-decoration: none;
}

h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  transition: color 0.2s;
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
  }

  h2 {
    font-size: 1.25rem;
  }
}
</style> 