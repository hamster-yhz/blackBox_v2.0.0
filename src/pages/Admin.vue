<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold">黑盒博客管理</h1>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              v-if="isAuthenticated"
              @click="showNewPostModal = true"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              新建文章
            </button>
            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              退出登录
            </button>
            <button
              v-else
              @click="$router.push('/login')"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold">文章列表</h2>
        </div>

        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <ul class="divide-y divide-gray-200">
            <li v-for="post in posts" :key="post.id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-indigo-600 truncate">
                    {{ post.title }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ new Date(post.date).toLocaleDateString() }}
                  </p>
                </div>
                <div v-if="isAuthenticated" class="flex items-center space-x-4">
                  <button
                    @click="editPost(post)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    编辑
                  </button>
                  <button
                    @click="handleDeletePost(post.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    删除
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- New Post Modal -->
    <div v-if="showNewPostModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div class="bg-white rounded-lg p-8 max-w-2xl w-full">
        <h3 class="text-lg font-medium mb-4">新建文章</h3>
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">标题</label>
              <input
                v-model="currentPost.title"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">内容</label>
              <textarea
                v-model="currentPost.content"
                rows="10"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">分类</label>
              <input
                v-model="currentPost.categories"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="用逗号分隔"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">标签</label>
              <input
                v-model="currentPost.tags"
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="用逗号分隔"
              />
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              @click="showNewPostModal = false"
              class="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              取消
            </button>
            <button
              type="submit"
              class="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../api/auth'
import { createPost, getPosts, deletePost } from '../api/posts'
import type { Article } from '../utils/markdown'

const router = useRouter()
const { isAuthenticated, logout: authLogout } = useAuth()

const posts = ref<Article[]>([])
const showNewPostModal = ref(false)
const currentPost = ref({
  title: '',
  content: '',
  categories: '',
  tags: '',
  excerpt: '',
})

onMounted(async () => {
  await loadPosts()
})

const loadPosts = async () => {
  try {
    posts.value = await getPosts()
  } catch (error) {
    console.error('Failed to load posts:', error)
  }
}

const handleSubmit = async () => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  try {
    const postData = {
      ...currentPost.value,
      categories: currentPost.value.categories.split(',').map(c => c.trim()),
      tags: currentPost.value.tags.split(',').map(t => t.trim()),
      date: new Date().toISOString(),
    }

    await createPost(postData)
    showNewPostModal.value = false
    await loadPosts()
    resetForm()
  } catch (error) {
    console.error('Failed to create post:', error)
  }
}

const editPost = (post: Article) => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  currentPost.value = {
    title: post.title,
    content: post.content,
    categories: post.categories.join(', '),
    tags: post.tags.join(', '),
    excerpt: post.summary,
  }
  showNewPostModal.value = true
}

const handleDeletePost = async (id: string) => {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }

  if (!confirm('确定要删除这篇文章吗？')) {
    return
  }

  try {
    await deletePost(id)
    await loadPosts()
  } catch (error) {
    console.error('Failed to delete post:', error)
  }
}

const resetForm = () => {
  currentPost.value = {
    title: '',
    content: '',
    categories: '',
    tags: '',
    excerpt: '',
  }
}

const handleLogout = () => {
  authLogout()
  router.push('/')
}
</script> 