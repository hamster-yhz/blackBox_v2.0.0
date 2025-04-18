<template>
  <div class="article-list">
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载文章中...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadArticles" class="retry-button">重试</button>
    </div>
    
    <template v-else>
      <article v-for="article in displayedArticles" :key="article.id" class="article-card">
        <div class="article-header">
          <router-link :to="`/article/${article.id}`" class="article-link">
            <h2 class="article-title">{{ article.title }}</h2>
          </router-link>
          
          <div class="article-meta">
            <span class="article-date">{{ formatDate(article.date) }}</span>
            <div class="article-categories">
              <span v-for="category in article.categories" :key="category" class="category">
                {{ category }}
              </span>
            </div>
            <span class="article-read-time">{{ article.readTime }}</span>
          </div>
        </div>
        
        <p class="article-summary">{{ article.summary }}</p>
        
        <div class="article-footer">
          <div class="footer-left">
            <div class="article-tags" v-if="article.tags && article.tags.length > 0">
              <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="footer-right">
            <router-link :to="`/article/${article.id}`" class="read-more">
              阅读更多
            </router-link>
          </div>
        </div>
      </article>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useArticles } from '../composables/useArticles'

const props = defineProps<{
  limit?: number
}>()

const { articles, loadArticles } = useArticles()
const isLoading = ref(true)
const error = ref<string | null>(null)

const displayedArticles = computed(() => {
  if (!props.limit) return articles.value
  return articles.value.slice(0, props.limit)
})

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

onMounted(async () => {
  try {
    await loadArticles()
  } catch (e) {
    error.value = '加载文章失败'
    console.error(e)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
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

.article-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-color);
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-color: var(--primary-color-light);
}

.article-header {
  margin-bottom: 0.75rem;
}

.article-link {
  text-decoration: none;
  display: block;
}

.article-title {
  color: var(--text-primary);
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0 0 0.75rem;
  transition: color 0.2s;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.article-title:hover {
  color: var(--primary-color);
}

.article-meta {
  display: flex;
  gap: 1.25rem;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
  align-items: center;
}

.article-meta > span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.article-date::before {
  content: '📅';
}

.article-categories {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.category {
  background: var(--primary-color-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.category::before {
  content: '📁';
  margin-right: 0.25rem;
}

.article-read-time::before {
  content: '⏱️';
}

.article-summary {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color);
  padding-top: 0.75rem;
  margin-top: 0.75rem;
}

.footer-left {
  flex: 1;
  min-width: 0;
}

.footer-right {
  flex-shrink: 0;
  margin-left: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  overflow: hidden;
}

.tag {
  background: var(--primary-color-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.tag:hover {
  background: var(--primary-color);
  color: white;
}

.read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  background: var(--primary-color-light);
  white-space: nowrap;
}

.read-more:hover {
  background: var(--primary-color);
  color: white;
}

.read-more::after {
  content: '→';
  transition: transform 0.2s;
}

.read-more:hover::after {
  transform: translateX(4px);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .article-list {
    padding: 1rem;
    gap: 1rem;
  }

  .article-card {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.2rem;
  }

  .article-meta {
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .article-card {
    padding: 0.875rem;
  }

  .article-meta {
    font-size: 0.8rem;
    gap: 0.5rem;
  }

  .article-footer {
    gap: 0.5rem;
  }

  .footer-right {
    margin-left: 0.5rem;
  }

  .tag {
    font-size: 0.7rem;
  }
}
</style> 