import { useAuth } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

interface Post {
  id: string
  title: string
  content: string
  date: string
  categories: string[]
  tags: string[]
  excerpt: string
}

export const createPost = async (post: Omit<Post, 'id'>) => {
  const { token } = useAuth()
  const response = await fetch(`${API_BASE_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`,
    },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw new Error('Failed to create post')
  }

  return response.json()
}

export const updatePost = async (id: string, post: Partial<Post>) => {
  const { token } = useAuth()
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.value}`,
    },
    body: JSON.stringify(post),
  })

  if (!response.ok) {
    throw new Error('Failed to update post')
  }

  return response.json()
}

export const deletePost = async (id: string) => {
  const { token } = useAuth()
  const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token.value}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to delete post')
  }
}

export const getPosts = async () => {
  const response = await fetch(`${API_BASE_URL}/posts`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  return response.json()
}

export const getPost = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/posts/${id}`)
  
  if (!response.ok) {
    throw new Error('Failed to fetch post')
  }

  return response.json()
} 