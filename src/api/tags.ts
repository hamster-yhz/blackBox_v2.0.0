import { ref } from 'vue'
import type { Ref } from 'vue'

export interface Tag {
  id: string
  name: string
  count: number
}

interface Article {
  tags?: string[]
}

const tags: Ref<Tag[]> = ref([])

export function useTags() {
  const loadTags = async () => {
    try {
      // 从文章数据中提取标签
      const articles = await import('../content/articles') as { [key: string]: Article }
      const tagCounts = new Map<string, number>()
      
      Object.values(articles).forEach(article => {
        if (article.tags) {
          article.tags.forEach((tag: string) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
          })
        }
      })
      
      tags.value = Array.from(tagCounts.entries()).map(([name, count]) => ({
        id: name,
        name,
        count
      }))
    } catch (error) {
      console.error('Error loading tags:', error)
      throw error
    }
  }
  
  const getTags = () => tags.value
  
  return {
    tags,
    loadTags,
    getTags
  }
} 