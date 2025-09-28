import { ref } from 'vue'
import type { Article } from '../utils/markdown'
import { parseMarkdown } from '../utils/markdown'
import type { Category } from './categories'

const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
let articlesLoaded = false

// 使用 import.meta.glob 加载所有文章
const markdownFiles = import.meta.glob('../../content/articles/*.md', { 
  eager: false, // 改为懒加载
  as: 'raw' 
})

// 解析所有文章
async function loadAndParseArticles(): Promise<Article[]> {
  try {
    const articlePromises = Object.entries(markdownFiles).map(async ([path, importFn]) => {
      try {
        const content = await importFn() as string
        const id = path.split('/').pop()?.replace('.md', '') || ''
        return parseMarkdown(content, id)
      } catch (error) {
        console.error(`Failed to load article from ${path}:`, error)
        return null
      }
    })
    
    const results = await Promise.all(articlePromises)
    return results
      .filter((article): article is Article => article !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Failed to load articles:', error)
    return []
  }
}

// 获取所有文章
export async function getArticles(): Promise<Article[]> {
  if (!articlesLoaded) {
    const parsedArticles = await loadAndParseArticles()
    articles.value = parsedArticles
    articlesLoaded = true
  }
  return articles.value
}

// 获取文章详情
export async function getArticleById(id: string): Promise<Article | undefined> {
  const allArticles = await getArticles()
  return allArticles.find(article => article.id === id)
}

// 获取分类文章
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const allArticles = await getArticles()
  return allArticles.filter(article => 
    article.categories.some(cat => 
      cat.toLowerCase() === category.toLowerCase()
    )
  )
}

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  if (categories.value.length === 0) {
    const allArticles = await getArticles()
    const categoryMap = new Map<string, number>()
    
    allArticles.forEach(article => {
      article.categories.forEach(category => {
        const normalizedCategory = category.trim()
        if (normalizedCategory) {
          categoryMap.set(normalizedCategory, (categoryMap.get(normalizedCategory) || 0) + 1)
        }
      })
    })
    
    categories.value = Array.from(categoryMap.entries())
      .map(([id, count]) => ({
        id,
        name: getCategoryName(id),
        count
      }))
      .sort((a, b) => b.count - a.count) // 按文章数量排序
  }
  
  return categories.value
}

// 获取分类名称
function getCategoryName(id: string): string {
  const names: Record<string, string> = {
    'frontend': '前端开发',
    'backend': '后端开发',
    'devops': 'DevOps',
    'algorithm': '算法',
    '技术分享': '技术分享',
    '学习笔记': '学习笔记',
    '推荐阅读': '推荐阅读'
  }
  return names[id] || id
}

// 重置加载状态（用于开发中的热重载）
export function resetArticlesCache(): void {
  articlesLoaded = false
  articles.value = []
  categories.value = []
}