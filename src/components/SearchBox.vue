<template>
  <div class="search-container" :class="{ 'is-active': isActive }">
    <div class="search-input-wrapper" @click="activate">
      <input
        ref="searchInput"
        v-model="searchQuery"
        type="text"
        class="search-input"
        placeholder="搜索文章..."
        @focus="activate"
        @blur="deactivate"
      />
      <div class="search-icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>
    </div>

    <!-- 快捷键提示 -->
    <div class="search-shortcut" v-if="!isActive">
      <span>按下</span>
      <kbd>Ctrl</kbd>
      <span>+</span>
      <kbd>K</kbd>
      <span>搜索</span>
    </div>

    <!-- 搜索结果 -->
    <Transition name="fade">
      <div v-if="isActive && searchResults.length > 0" class="search-results">
        <router-link
          v-for="result in searchResults"
          :key="result.item.id"
          :to="`/article/${result.item.id}`"
          class="search-result-item"
          @click="deactivate"
        >
          <h3>{{ result.item.title }}</h3>
          <p>{{ result.item.summary }}</p>
          <div class="meta">
            <span>{{ result.item.createdAt }}</span>
          </div>
        </router-link>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import Fuse from 'fuse.js'
import { useArticles } from '../composables/useArticles'

const searchInput = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const isActive = ref(false)
const searchResults = ref<Fuse.FuseResult<any>[]>([])

const { articles } = useArticles()

// 配置 Fuse.js
const fuse = new Fuse(articles.value, {
  keys: ['title', 'summary', 'content'],
  threshold: 0.3,
  distance: 100,
  minMatchCharLength: 2
})

// 监听搜索输入
watch(searchQuery, (newQuery) => {
  if (newQuery.trim()) {
    searchResults.value = fuse.search(newQuery).slice(0, 5)
  } else {
    searchResults.value = []
  }
})

// 激活搜索
function activate() {
  isActive.value = true
}

// 取消激活
function deactivate() {
  setTimeout(() => {
    isActive.value = false
    searchQuery.value = ''
  }, 200)
}

// 快捷键处理
function handleShortcut(event: KeyboardEvent) {
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    activate()
    searchInput.value?.focus()
  }
}

// 监听快捷键
onMounted(() => {
  window.addEventListener('keydown', handleShortcut)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleShortcut)
})
</script>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 600px;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 0.5rem 2.5rem 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 0.9rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-color-alpha);
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.5rem;
}

.search-result-item {
  display: block;
  padding: 1rem;
  text-decoration: none;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.2s;
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background: var(--bg-hover);
}

.search-result-item h3 {
  margin: 0 0 0.5rem;
  color: var(--text-primary);
  font-size: 1rem;
}

.search-result-item p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.9rem;
  line-height: 1.4;
}

.meta {
  margin-top: 0.5rem;
  color: var(--text-tertiary);
  font-size: 0.8rem;
}

.search-shortcut {
  position: absolute;
  top: 50%;
  right: 2.5rem;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-tertiary);
  font-size: 0.8rem;
  pointer-events: none;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
}

.search-container:not(.is-active) .search-shortcut {
  opacity: 1;
}

kbd {
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  background: var(--bg-hover);
  border: 1px solid var(--border-color);
  font-size: 0.8rem;
  font-family: monospace;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .search-shortcut {
    display: none;
  }

  .search-input {
    padding-right: 2rem;
  }

  .search-results {
    position: absolute;
    width: 100%;
    left: 0;
    margin-top: 0.5rem;
  }
}
</style> 