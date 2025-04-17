import type { Category, CategoryDetail } from '../api/categories'
import type { Tag, TagDetail } from '../api/tags'

// 模拟文章数据
const articles = [
  {
    id: '1',
    title: 'Vue 3 组合式 API 完全指南',
    createdAt: '2024-03-20',
    summary: '深入探讨 Vue 3 组合式 API 的使用方法和最佳实践...',
    category: 'frontend',
    readTime: '10 分钟阅读'
  },
  {
    id: '2',
    title: 'TypeScript 高级类型实战',
    createdAt: '2024-03-19',
    summary: '探索 TypeScript 中的高级类型用法，提升类型安全...',
    category: 'frontend',
    readTime: '15 分钟阅读'
  },
  {
    id: '3',
    title: 'Docker 容器化实践',
    createdAt: '2024-03-18',
    summary: '学习如何使用 Docker 容器化你的应用...',
    category: 'devops',
    readTime: '12 分钟阅读'
  }
]

// 计算每个分类的文章数量
const getArticleCount = (category: string) => articles.filter(a => a.category === category).length
const getArticlesByCategory = (category: string) => articles.filter(a => a.category === category)

export const categories: Category[] = [
  {
    id: 'frontend',
    name: '前端开发',
    count: getArticleCount('frontend')
  },
  {
    id: 'backend',
    name: '后端开发',
    count: getArticleCount('backend')
  },
  {
    id: 'devops',
    name: 'DevOps',
    count: getArticleCount('devops')
  },
  {
    id: 'algorithm',
    name: '算法',
    count: getArticleCount('algorithm')
  }
]

export const tags: Tag[] = [
  {
    id: 'vue',
    name: 'Vue',
    count: 2
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    count: 2
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    count: 1
  },
  {
    id: 'nodejs',
    name: 'Node.js',
    count: 1
  },
  {
    id: 'docker',
    name: 'Docker',
    count: 1
  }
]

// 模拟分类详情数据
export const categoryDetails: Record<string, CategoryDetail> = {
  frontend: {
    id: 'frontend',
    name: '前端开发',
    count: getArticleCount('frontend'),
    articles: getArticlesByCategory('frontend')
  },
  backend: {
    id: 'backend',
    name: '后端开发',
    count: getArticleCount('backend'),
    articles: getArticlesByCategory('backend')
  },
  devops: {
    id: 'devops',
    name: 'DevOps',
    count: getArticleCount('devops'),
    articles: getArticlesByCategory('devops')
  },
  algorithm: {
    id: 'algorithm',
    name: '算法',
    count: getArticleCount('algorithm'),
    articles: getArticlesByCategory('algorithm')
  }
}

// 模拟标签详情数据
export const tagDetails: Record<string, TagDetail> = {
  vue: {
    id: 'vue',
    name: 'Vue',
    count: 2,
    articles: [articles[0]]
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript',
    count: 2,
    articles: [articles[1]]
  }
} 