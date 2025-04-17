<template>
  <div class="article-page">
    <article class="article" v-if="article">
      <header class="article-header">
        <h1>{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ article.createdAt }}</span>
          <span class="article-read-time">{{ article.readTime || '5 分钟阅读' }}</span>
        </div>
      </header>

      <ArticleContent :content="article.content" />
      
      <footer class="article-footer">
        <div class="article-category">
          分类：
          <router-link :to="`/categories/${article.category}`">
            {{ getCategoryName(article.category) }}
          </router-link>
        </div>
      </footer>
    </article>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else class="loading">
      加载中...
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ArticleContent from '../components/ArticleContent.vue'
import { useArticles } from '../composables/useArticles'

const route = useRoute()
const { getArticleById } = useArticles()
const article = ref<any>(null)
const error = ref<string | null>(null)

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

onMounted(() => {
  try {
    const id = route.params.id as string
    console.log('Article ID:', id)
    const result = getArticleById(id)
    console.log('Article data:', result)
    
    if (result) {
      article.value = result
    } else {
      error.value = '文章不存在'
    }
  } catch (e) {
    error.value = '加载文章失败'
    console.error('Error loading article:', e)
  }
})
</script>

<style scoped>
.article-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.article-header {
  margin-bottom: 3rem;
}

h1 {
  color: var(--text-primary);
  font-size: 2.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.article-category {
  color: var(--text-secondary);
}

.article-category a {
  color: var(--primary-color);
  text-decoration: none;
}

.article-category a:hover {
  text-decoration: underline;
}

.error-message {
  text-align: center;
  color: var(--error-color);
  padding: 2rem;
}

.loading {
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
}

@media (max-width: 768px) {
  .article-page {
    padding: 1rem;
  }

  h1 {
    font-size: 2rem;
  }
}
</style> 