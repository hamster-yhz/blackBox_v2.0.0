<template>
  <div class="search-container">
    <div class="search-input-wrapper">
      <input
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索文章..."
        @focus="showResults = true"
      />
      <div class="search-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
      <div class="shortcut-hint">
        <span class="shortcut-key">Ctrl</span>
        <span>+</span>
        <span class="shortcut-key">K</span>
      </div>
    </div>

    <div v-if="showResults && searchQuery" class="search-results" v-click-outside="hideResults">
      <div v-if="loading" class="search-message">
        搜索中...
      </div>
      <div v-else-if="error" class="search-message error">
        {{ error }}
      </div>
      <div v-else-if="results.length === 0" class="search-message">
        未找到相关文章
      </div>
      <template v-else>
        <router-link
          v-for="result in results"
          :key="result.item.id"
          :to="`/article/${result.item.id}`"
          class="search-result-item"
          @click="hideResults"
        >
          <h3>{{ result.item.title }}</h3>
          <p>{{ result.item.summary }}</p>
          <div class="meta">
            <span>{{ formatDate(result.item.createdAt) }}</span>
            <span class="tags">
              <span v-for="tag in result.item.tags" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </span>
          </div>
        </router-link>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Fuse from 'fuse.js'
import { useArticles } from '../composables/useArticles'
import { vClickOutside } from '../directives/clickOutside'

const searchQuery = ref('')
const showResults = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
const results = ref<any[]>([])

const { articles, loadArticles } = useArticles()

// Fuse.js 配置
const fuseOptions = {
  keys: ['title', 'summary', 'content', 'tags'],
  threshold: 0.4,
  includeMatches: true
}

let fuse: Fuse<any>

// 初始化 Fuse 实例
async function initFuse() {
  try {
    loading.value = true
    error.value = null
    await loadArticles()
    fuse = new Fuse(articles.value, fuseOptions)
  } catch (e) {
    error.value = '加载搜索数据失败'
    console.error('Error initializing search:', e)
  } finally {
    loading.value = false
  }
}

// 监听搜索输入
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    results.value = []
    return
  }
  if (!fuse) {
    initFuse()
    return
  }
  results.value = fuse.search(newQuery)
})

function hideResults() {
  showResults.value = false
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 初始化
initFuse()
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  min-width: 300px;
  max-width: 800px;
  height: 40px;
  padding: 0.5rem 7rem 0.5rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.875rem;
  transition: all 0.2s ease;

  &::placeholder {
    color: var(--text-secondary);
    opacity: 0.8;
  }

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }

  @media (max-width: 640px) {
    min-width: 200px;
    padding-right: 6rem;
  }
}

.shortcut-hint {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  color: var(--text-secondary);
  opacity: 0.6;
  pointer-events: none;
  font-size: 0.75rem;
  background-color: var(--bg-secondary);
}

.shortcut-key {
  padding: 0.125rem 0.375rem;
  background-color: var(--bg-tertiary);
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  opacity: 0.8;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  opacity: 0.8;
  cursor: pointer;
  
  &:hover {
    opacity: 1;
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  max-height: 400px;
  overflow-y: auto;
  z-index: 50;
}

.search-message {
  padding: 1rem;
  text-align: center;
  color: #64748b;
}

.search-message.error {
  color: #ef4444;
}

.search-result-item {
  display: block;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: background-color 0.2s;
  text-decoration: none;
  color: inherit;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: #f8fafc;
}

.search-result-item h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.search-result-item p {
  font-size: 0.9rem;
  color: #64748b;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #94a3b8;
}

.tags {
  display: flex;
  gap: 0.5rem;
}

.tag {
  color: var(--primary-color);
}

@media (max-width: 640px) {
  .search-results {
    position: fixed;
    top: 4rem;
    left: 1rem;
    right: 1rem;
    max-height: calc(100vh - 5rem);
  }

  .search-input {
    min-width: 200px;
    padding-right: 4rem;
  }
  
  .shortcut-hint {
    font-size: 0.7rem;
  }
  
  .shortcut-key {
    padding: 0.125rem 0.25rem;
  }
}
</style> 