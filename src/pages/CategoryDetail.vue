<template>
  <div class="category-detail" :class="{ 'dark': isDark }">
    <div class="category-header">
      <h1>{{ getCategoryName(categoryId) }}</h1>
      <p>{{ articles.length }} 篇文章</p>
    </div>

    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
      <button @click="fetchArticles" class="retry-button">重试</button>
    </div>

    <div v-else class="articles-container">
      <div v-for="article in articles" :key="article.id" class="article-card">
        <router-link :to="`/article/${article.id}`" class="article-link">
          <div class="article-content">
            <h2 class="article-title">{{ article.title }}</h2>
            <p class="article-summary">{{ article.summary }}</p>
            <div class="article-meta">
              <span class="article-date">{{ formatDate(article.date) }}</span>
              <span class="article-read-time">{{ article.readTime }}</span>
            </div>
            <div class="article-tags" v-if="article.tags && article.tags.length">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </router-link>
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
import { useTheme } from '../composables/useTheme'

const route = useRoute()
const categoryId = computed(() => route.params.id as string)
const articles = ref<Article[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const { isDark } = useTheme()

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

// 格式化日期
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  border-color: var(--border-color-hover);
}

.article-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 1.5rem;
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.article-summary {
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-tertiary);
  font-size: 0.9rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: var(--bg-tag);
  color: var(--text-tag);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error-message {
  text-align: center;
  color: var(--error-color);
  padding: 2rem;
}

.retry-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: var(--primary-color-hover);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .category-detail {
    padding: 1rem;
  }

  .category-header {
    margin-bottom: 2rem;
  }

  .category-header h1 {
    font-size: 2rem;
  }

  .article-card {
    border-radius: 8px;
  }

  .article-link {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.25rem;
  }

  .article-meta {
    font-size: 0.8rem;
  }

  .tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.6rem;
  }
}
</style> 