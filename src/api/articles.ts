import { ref } from 'vue'
import type { Article } from '../utils/markdown'
import { parseMarkdown } from '../utils/markdown'
import type { Category } from './categories'

const articles = ref<Article[]>([])
const categories = ref<Category[]>([])

// 使用 import.meta.glob 加载所有文章
const markdownFiles = import.meta.glob('../../content/articles/*.md', { 
  eager: true, 
  as: 'raw' 
})

// 解析所有文章
const parsedArticles = Object.entries(markdownFiles).map(([path, content]) => {
  const id = path.split('/').pop()?.replace('.md', '') || ''
  return parseMarkdown(content as string, id)
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

// 获取所有文章
export async function getArticles(): Promise<Article[]> {
  return parsedArticles
}

// 获取文章详情
export async function getArticleById(id: string): Promise<Article | undefined> {
  return parsedArticles.find(article => article.id === id)
}

// 获取分类文章
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  return parsedArticles.filter(article => article.categories.includes(category))
}

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  const categoryMap = new Map<string, number>()
  parsedArticles.forEach(article => {
    article.categories.forEach(category => {
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
    })
  })
  
  return Array.from(categoryMap.entries()).map(([id, count]) => ({
    id,
    name: getCategoryName(id),
    count
  }))
}

// 获取分类名称
function getCategoryName(id: string): string {
  const names: Record<string, string> = {
    frontend: '前端开发',
    backend: '后端开发',
    devops: 'DevOps',
    algorithm: '算法'
  }
  return names[id] || id
}

// 初始化数据
articles.value = parsedArticles
categories.value = await getCategories() 