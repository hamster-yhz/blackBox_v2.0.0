import type { Category, CategoryDetail } from './types'
import { categories, categoryDetails } from '../mock/data'

export type { Category, CategoryDetail }

export async function getCategories(): Promise<Category[]> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  return categories
}

export async function getCategoryById(id: string): Promise<CategoryDetail> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const category = categoryDetails[id]
  if (!category) {
    throw new Error(`Category not found: ${id}`)
  }
  return category
} 