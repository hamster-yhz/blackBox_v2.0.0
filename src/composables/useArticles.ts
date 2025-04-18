import { ref } from 'vue'
import { getArticles, getArticleById, getArticlesByCategory } from '../api/articles'
import type { Article } from '../utils/markdown'

const articles = ref<Article[]>([])
const isLoading = ref(true)
const error = ref<Error | null>(null)

export function useArticles() {
  async function loadArticles() {
    try {
      isLoading.value = true
      error.value = null
      const loadedArticles = await getArticles()
      articles.value = loadedArticles
      return loadedArticles
    } catch (e) {
      console.error('Failed to load articles:', e)
      error.value = e instanceof Error ? e : new Error('Failed to load articles')
      throw error.value
    } finally {
      isLoading.value = false
    }
  }

  async function loadArticleById(id: string) {
    try {
      const article = await getArticleById(id)
      if (!article) {
        throw new Error(`Article not found: ${id}`)
      }
      return article
    } catch (e) {
      console.error(`Failed to load article ${id}:`, e)
      throw e
    }
  }

  async function loadArticlesByCategory(category: string) {
    try {
      const categoryArticles = await getArticlesByCategory(category)
      return categoryArticles
    } catch (e) {
      console.error(`Failed to load articles for category ${category}:`, e)
      throw e
    }
  }

  async function loadRecommendedArticles() {
    try {
      const recommendedArticles = await getArticlesByCategory('推荐阅读')
      // 返回最多3篇推荐文章
      return recommendedArticles.slice(0, 3)
    } catch (e) {
      console.error('Failed to load recommended articles:', e)
      // 如果出错，返回空数组而不是抛出错误，防止页面崩溃
      return []
    }
  }

  // 确保文章数据已加载
  if (articles.value.length === 0) {
    loadArticles()
  }

  return {
    articles,
    isLoading,
    error,
    loadArticles,
    loadArticleById,
    loadArticlesByCategory,
    loadRecommendedArticles
  }
} 