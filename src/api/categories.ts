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
  const categoryMap = new Map<string, { count: number, name: string }>()
  
  articles.forEach(article => {
    if (article.categories && Array.isArray(article.categories)) {
      article.categories.forEach(category => {
        const existing = categoryMap.get(category) || { count: 0, name: getCategoryName(category) }
        categoryMap.set(category, {
          count: existing.count + 1,
          name: existing.name
        })
      })
    }
  })
  
  // 将分类转换为数组并排序
  let categories = Array.from(categoryMap.entries()).map(([id, data]) => ({
    id,
    name: data.name,
    count: data.count
  }))

  // 如果存在推荐阅读分类，将其移到第一位
  const recommendedIndex = categories.findIndex(cat => cat.id === '推荐阅读')
  if (recommendedIndex !== -1) {
    const recommended = categories.splice(recommendedIndex, 1)[0]
    categories = [recommended, ...categories]
  }
  
  return categories
}

// 获取分类详情
export async function getCategoryById(id: string): Promise<CategoryDetail> {
  const articles = await getArticles()
  const categoryArticles = articles.filter(article => 
    article.categories && Array.isArray(article.categories) && article.categories.includes(id)
  )
  
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
export function getCategoryName(id: string): string {
  const names: Record<string, string> = {
    frontend: '前端开发',
    backend: '后端开发',
    devops: 'DevOps',
    algorithm: '算法'
  }
  return names[id] || id
} 