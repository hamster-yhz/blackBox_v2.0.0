<template>
  <div class="article-container" :class="{ 'dark': isDark }">
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else-if="article" class="article-content">
      <article class="markdown-body prose dark:prose-invert">
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <span class="article-date">{{ formatDate(article.date) }}</span>
          <span class="article-category">{{ getCategoryName(article.category) }}</span>
          <span class="article-read-time">{{ article.readTime }}</span>
        </div>
        <div class="article-tags" v-if="article.tags && article.tags.length">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
        <div ref="contentRef" v-html="content"></div>
      </article>
    </div>
    
    <div class="toc-container" v-if="tocItems.length > 0">
      <div class="toc-title">目录</div>
      <nav class="toc">
        <TocItem
          v-for="item in tocItems"
          :key="item.id"
          :item="item"
          :active-heading="activeHeading"
          @click="handleTocClick"
        />
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById } from '../api/articles'
import type { Article } from '../utils/markdown'
import { useTheme } from '../composables/useTheme'
import 'highlight.js/styles/github-dark.css'
import { Marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import TocItem from '../components/TocItem.vue'

// Import commonly used languages
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import markdown from 'highlight.js/lib/languages/markdown'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('css', css)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('markdown', markdown)

// Configure marked
const marked = new Marked({
  highlight(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value
      } catch (e) {
        console.error('Failed to highlight code block:', e)
        return code
      }
    }
    return code
  },
  breaks: true,
  gfm: true
})

const route = useRoute()
const article = ref<Article | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const tocItems = ref<TocItem[]>([])
const activeHeading = ref('')
const { isDark } = useTheme()
const contentRef = ref<HTMLElement | null>(null)

interface TocItem {
  id: string
  text: string
  level: number
  children: TocItem[]
}

const processContent = (content: string): { html: string, toc: TocItem[] } => {
  const items: TocItem[] = []
  let processedContent = content

  // 处理标题并生成目录项
  processedContent = content.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title) => {
    const level = hashes.length
    const text = title.trim()
    // 生成一个更可靠的唯一ID
    const id = `heading-${Math.random().toString(36).substr(2, 9)}`

    items.push({ id, text, level, children: [] })
    return `<h${level} id="${id}">${text}</h${level}>`
  })

  // 使用 marked 处理 Markdown
  const html = marked.parse(processedContent)

  return {
    html,
    toc: buildTocTree(items)
  }
}

const buildTocTree = (items: TocItem[]): TocItem[] => {
  const root: TocItem[] = []
  const stack: TocItem[] = []

  items.forEach(item => {
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(item)
    } else {
      stack[stack.length - 1].children.push(item)
    }
    stack.push(item)
  })

  return root
}

const content = computed(() => {
  if (!article.value?.content) return ''
  const result = processContent(article.value.content)
  tocItems.value = result.toc
  return result.html
})

// 更新当前标题
function updateActiveHeading() {
  if (!contentRef.value) return

  const headings = Array.from(contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  if (headings.length === 0) return

  const scrollTop = window.scrollY
  const viewportHeight = window.innerHeight
  const threshold = 150 // 阈值，用于确定标题是否在视图中

  // 找到当前视口中最靠上的标题
  let currentHeading = null
  let minDistance = Infinity

  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    const distance = Math.abs(rect.top - threshold)
    
    if (rect.top <= threshold && distance < minDistance) {
      minDistance = distance
      currentHeading = heading
    }
  })

  // 如果没有找到在阈值之上的标题，就找最接近视口顶部的标题
  if (!currentHeading) {
    headings.forEach(heading => {
      const rect = heading.getBoundingClientRect()
      const distance = Math.abs(rect.top)
      
      if (distance < minDistance) {
        minDistance = distance
        currentHeading = heading
      }
    })
  }

  // 更新高亮状态
  if (currentHeading && currentHeading.id !== activeHeading.value) {
    activeHeading.value = currentHeading.id
  }
}

// 滚动到指定标题
function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  // 获取目标元素的位置
  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + window.pageYOffset
  const middle = 150 // 距离顶部的固定距离

  // 计算需要滚动的位置
  const scrollTo = absoluteElementTop - middle

  // 平滑滚动到目标位置
  window.scrollTo({
    top: scrollTo,
    behavior: 'smooth'
  })

  // 更新高亮状态和 URL
  activeHeading.value = id
  history.pushState(null, '', `#${id}`)
}

// 处理目录点击
function handleTocClick(event: MouseEvent, id: string) {
  event.preventDefault()
  activeHeading.value = id // 立即更新高亮状态
  scrollToHeading(id)
}

// 格式化日期
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 获取分类名称
function getCategoryName(id: string): string {
  const categoryNames: Record<string, string> = {
    'frontend': '前端开发',
    'backend': '后端开发',
    'devops': 'DevOps',
    'algorithm': '算法'
  }
  return categoryNames[id] || id
}

onMounted(async () => {
  try {
    const id = route.params.id as string
    const data = await getArticleById(id)
    if (data) {
      article.value = data
      
      await nextTick()
      
      // 使用 ResizeObserver 监听内容变化
      const observer = new ResizeObserver(() => {
        updateActiveHeading()
      })
      
      if (contentRef.value) {
        observer.observe(contentRef.value)
      }

      // 添加优化后的滚动监听
      let scrollTimeout: number | null = null
      const scrollHandler = () => {
        if (scrollTimeout) {
          window.cancelAnimationFrame(scrollTimeout)
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
          updateActiveHeading()
          scrollTimeout = null
        })
      }

      window.addEventListener('scroll', scrollHandler, { passive: true })
      
      // 保存清理函数
      onUnmounted(() => {
        observer.disconnect()
        window.removeEventListener('scroll', scrollHandler)
      })

      // 处理初始 hash
      const hash = window.location.hash.slice(1)
      if (hash) {
        setTimeout(() => {
          scrollToHeading(hash)
        }, 100)
      }
    } else {
      error.value = '文章不存在'
    }
  } catch (e) {
    error.value = '加载文章失败'
    console.error(e)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.article-container {
  display: flex;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.article-content {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 2.5rem !important;
  margin-top: 0 !important;
  margin-bottom: 1rem !important;
}

.article-meta {
  display: flex;
  gap: 1rem;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.article-tags {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tag {
  background: var(--primary-color-light);
  color: var(--primary-color);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
}

.toc-container {
  position: sticky;
  top: 4rem;
  width: 250px;
  max-height: calc(100vh - 6rem);
  overflow-y: auto;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toc-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.toc {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toc-item-wrapper {
  margin-bottom: 0.25rem;
}

.toc-children {
  margin-left: 1rem;
}

/* Update level styles to work with nested structure */
.level-1 { margin-left: 0; }
.level-2 { margin-left: 1rem; }
.level-3 { margin-left: 2rem; }
.level-4 { margin-left: 3rem; }
.level-5 { margin-left: 4rem; }
.level-6 { margin-left: 5rem; }

/* Remove old level styles */
.toc-item {
  display: block;
  padding: 0.25rem 0;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.toc-item:hover {
  color: var(--primary-color);
}

.toc-item.active {
  color: var(--primary-color);
  font-weight: 500;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message {
  text-align: center;
  color: var(--error-color);
  padding: 2rem;
}

@media (max-width: 768px) {
  .article-container {
    flex-direction: column;
    padding: 1rem;
  }

  .toc-container {
    position: relative;
    top: 0;
    width: 100%;
    margin-bottom: 2rem;
  }

  .article-title {
    font-size: 2rem !important;
  }
}

/* Markdown 样式 */
:deep(.markdown-body) {
  color: var(--text-primary);
  line-height: 1.6;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  scroll-margin-top: 80px; /* 添加滚动边距 */
}

:deep(.markdown-body p) {
  margin-bottom: 1rem;
}

:deep(.markdown-body code) {
  background: var(--code-bg);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
}

:deep(.markdown-body pre) {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: var(--code-block-bg) !important;
  overflow-x: auto;
}

:deep(.markdown-body pre code) {
  background: none;
  padding: 0;
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  -webkit-font-smoothing: auto;
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

:deep(.markdown-body blockquote) {
  margin: 1rem 0;
  padding: 0.5rem 1rem;
  border-left: 4px solid var(--primary-color);
  background: var(--blockquote-bg);
  color: var(--text-secondary);
}

.dark :deep(.markdown-body) {
  color: #e5e7eb;
}

.dark :deep(.markdown-body h1),
.dark :deep(.markdown-body h2),
.dark :deep(.markdown-body h3),
.dark :deep(.markdown-body h4),
.dark :deep(.markdown-body h5),
.dark :deep(.markdown-body h6) {
  color: #f3f4f6;
}

:deep(.hljs) {
  background: transparent !important;
  padding: 0 !important;
  color: inherit;
}

/* 代码高亮主题相关颜色 */
.dark :deep(.hljs-keyword),
.dark :deep(.hljs-selector-tag),
.dark :deep(.hljs-title),
.dark :deep(.hljs-section) {
  color: #cc99cd;
}

.dark :deep(.hljs-string),
.dark :deep(.hljs-selector-attr),
.dark :deep(.hljs-selector-pseudo),
.dark :deep(.hljs-regexp) {
  color: #7ec699;
}

.dark :deep(.hljs-literal),
.dark :deep(.hljs-number) {
  color: #f08d49;
}

.dark :deep(.hljs-variable),
.dark :deep(.hljs-template-variable) {
  color: #7ec699;
}

.dark :deep(.hljs-comment) {
  color: #999;
}

.dark :deep(.hljs-doctag) {
  color: #cc99cd;
}
</style> 