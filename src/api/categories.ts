import { getArticles } from './articles'

export interface Category {
  id: string
  name: string
  count: number
}

export interface CategoryDetail {
  id: string
  name: string
  articles: Array<{
    id: string
    title: string
    date: string
    readTime: string
    summary: string
  }>
}

// 获取所有分类
export async function getCategories(): Promise<Category[]> {
  const articles = await getArticles()
  const categoryMap = new Map<string, number>()
  
  articles.forEach(article => {
    categoryMap.set(article.category, (categoryMap.get(article.category) || 0) + 1)
  })
  
  return Array.from(categoryMap.entries()).map(([id, count]) => ({
    id,
    name: getCategoryName(id),
    count
  }))
}

// 获取分类详情
export async function getCategoryById(id: string): Promise<CategoryDetail> {
  const articles = await getArticles()
  const categoryArticles = articles.filter(article => article.category === id)
  
  if (categoryArticles.length === 0) {
    throw new Error(`Category not found: ${id}`)
  }
  
  return {
    id,
    name: getCategoryName(id),
    articles: categoryArticles.map(article => ({
      id: article.id,
      title: article.title,
      date: article.date,
      readTime: article.readTime,
      summary: article.summary
    }))
  }
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