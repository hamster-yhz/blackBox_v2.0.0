import type { Tag, TagDetail } from './types'
import { tags, tagDetails } from '../mock/data'

export type { Tag, TagDetail }

export async function getTags(): Promise<Tag[]> {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  return tags
}

export async function getTagById(id: string): Promise<TagDetail> {
  await new Promise(resolve => setTimeout(resolve, 500))
  const tag = tagDetails[id]
  if (!tag) {
    throw new Error(`Tag not found: ${id}`)
  }
  return tag
} 