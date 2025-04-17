export interface Article {
  id: string
  title: string
  summary: string
  content: string
  createdAt: string
  category: string
  tags: string[]
  author: string
  cover?: string
} 