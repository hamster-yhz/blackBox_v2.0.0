<template>
  <div class="category-detail">
    <header class="category-header">
      <h1>{{ getCategoryName(categoryId) }}</h1>
      <p>{{ articles.length }} 篇文章</p>
    </header>

    <div class="articles-container">
      <article v-for="article in articles" :key="article.id" class="article-card">
        <router-link :to="`/article/${article.id}`" class="article-link">
          <h2>{{ article.title }}</h2>
        </router-link>
        
        <div class="article-meta">
          <span class="article-date">{{ article.createdAt }}</span>
          <span class="article-read-time">{{ article.readTime || '5 分钟阅读' }}</span>
        </div>
        
        <p class="article-summary">{{ article.summary }}</p>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useArticles } from '../composables/useArticles'

const route = useRoute()
const categoryId = computed(() => route.params.id as string)
const { getArticlesByCategory } = useArticles()

const articles = computed(() => getArticlesByCategory(categoryId.value))

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