<template>
  <div class="article-list">
    <article v-for="article in articles" :key="article.id" class="article-card">
      <router-link :to="`/article/${article.id}`" class="article-link">
        <h2 class="article-title">{{ article.title }}</h2>
      </router-link>
      
      <div class="article-meta">
        <span class="article-date">{{ article.createdAt }}</span>
        <span class="article-author">管理员</span>
        <span class="article-read-time">{{ article.readTime || '5 分钟阅读' }}</span>
      </div>
      
      <p class="article-summary">{{ article.summary }}</p>
      
      <div class="article-footer">
        <router-link :to="`/article/${article.id}`" class="read-more">
          阅读更多
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { useArticles } from '../composables/useArticles'

const { articles } = useArticles()
</script>

<style scoped>
.article-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
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

.article-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  margin: 0 0 1rem;
  transition: color 0.2s;
}

.article-title:hover {
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

.article-footer {
  display: flex;
  justify-content: flex-end;
}

.read-more {
  color: var(--primary-color);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}

.read-more:hover {
  color: var(--primary-color-dark);
}

@media (max-width: 768px) {
  .article-list {
    padding: 1rem;
  }

  .article-card {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.25rem;
  }
}
</style> 