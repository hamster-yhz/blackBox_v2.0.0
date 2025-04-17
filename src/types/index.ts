export interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  date: string
  category: string
  tags: string[]
  author: string
  readingTime: number
}

export interface Category {
  id: string
  name: string
  description: string
  count: number
}

export interface Tag {
  id: string
  name: string
  count: number
} 