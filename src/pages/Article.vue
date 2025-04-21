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
          <span class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {{ formatDate(article.date) }}
          </span>
          <span class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            {{ article.categories[0] }}
          </span>
          <span class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ article.readTime }}
          </span>
        </div>
        <div class="article-tags" v-if="article.tags && article.tags.length">
          <span v-for="tag in article.tags" :key="tag" class="tag">
            {{ tag }}
          </span>
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

    <!-- 添加移动端悬浮按钮和弹出层 -->
    <Teleport to="body">
      <div v-if="isMobileView && showFloatingButton" class="floating-toc-button" @click="showMobileToc = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>

      <div v-if="showMobileToc" class="mobile-toc-modal" @click.self="showMobileToc = false">
        <div class="mobile-toc-content">
          <div class="mobile-toc-header">
            <h3>目录</h3>
            <button class="close-button" @click="showMobileToc = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav class="toc">
            <TocItem
              v-for="item in tocItems"
              :key="item.id"
              :item="item"
              :active-heading="activeHeading"
              @click="handleMobileTocClick"
            />
          </nav>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleById } from '../api/articles'
import type { Article } from '../utils/markdown'
import { useTheme } from '../composables/useTheme'
import { Marked } from 'marked'
import { configureHighlight, applyHighlight } from '../utils/highlight'
import TocItem from '../components/TocItem.vue'

interface TocItem {
  id: string
  text: string
  level: number
  children: TocItem[]
}

// Configure marked
const marked = new Marked({
  ...configureHighlight(),
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
const lastScrollTop = ref(0)

// 移动端状态管理
const showFloatingButton = ref(false)
const showMobileToc = ref(false)
const windowWidth = ref(window.innerWidth)
const isMobileView = computed(() => windowWidth.value <= 768)

const processContent = (content: string): { html: string, toc: TocItem[] } => {
  const items: TocItem[] = []
  
  // 先处理代码块，将代码块中的 # 替换为特殊标记
  let processedContent = content.replace(/```[\s\S]*?```/g, (match) => {
    return match.replace(/#/g, '§')
  })
  
  // 处理标题并生成目录项
  processedContent = processedContent.replace(/^(#{1,6})\s+(.+)$/gm, (_match, hashes, title) => {
    const level = hashes.length
    const text = title.trim()
    // 生成一个更可靠的唯一ID
    const id = `heading-${Math.random().toString(36).substr(2, 9)}`

    items.push({ id, text, level, children: [] })
    return `<h${level} id="${id}">${text}</h${level}>`
  })
  
  // 恢复代码块中的 # 符号
  processedContent = processedContent.replace(/§/g, '#')
  
  // 使用 marked 处理 Markdown
  const html = String(marked.parse(processedContent))

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
  
  // 在下一个 tick 应用代码高亮
  nextTick(() => {
    if (contentRef.value) {
      applyHighlight(contentRef.value)
    }
  })
  
  return result.html
})

// 更新当前标题
function updateActiveHeading() {
  if (!contentRef.value) return

  const headings = Array.from(contentRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6'))
  if (headings.length === 0) return

  const threshold = 150 // 阈值，用于确定标题是否在视图中

  // 找到当前视口中最靠上的标题
  let currentHeading: Element | null = null
  let minDistance = Infinity

  headings.forEach(heading => {
    const rect = heading.getBoundingClientRect()
    const distance = Math.abs(rect.top - threshold)
    
    if (rect.top <= threshold && distance < minDistance) {
      minDistance = distance
      currentHeading = heading
    }
  })

  if (currentHeading) {
    const headingId = (currentHeading as unknown as HTMLElement).id
    if (headingId && headingId !== activeHeading.value) {
      activeHeading.value = headingId
    }
  }
}

// 滚动到指定标题
function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (!element) return

  // 获取目标元素的位置
  const elementRect = element.getBoundingClientRect()
  const absoluteElementTop = elementRect.top + window.pageYOffset
  const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-height')) || 64
  const offset = 24 // 额外的偏移量，让标题和导航栏之间有一定间距

  // 计算需要滚动的位置，考虑导航栏高度
  const scrollTo = absoluteElementTop - headerHeight - offset

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

// 处理移动端目录点击
function handleMobileTocClick(event: MouseEvent, id: string) {
  handleTocClick(event, id)
  showMobileToc.value = false
}

// 处理滚动事件
function handleScroll() {
  const currentScrollTop = window.scrollY
  const scrollingDown = currentScrollTop > lastScrollTop.value
  
  if (scrollingDown) {
    showFloatingButton.value = true
  } else {
    showFloatingButton.value = false
  }
  
  lastScrollTop.value = currentScrollTop
  updateActiveHeading()
}

// 监听窗口大小变化
function handleResize() {
  windowWidth.value = window.innerWidth
}

// 格式化日期
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 创建一个清理函数
let cleanup: (() => void) | null = null

// 注册清理函数
onUnmounted(() => {
  if (cleanup) {
    cleanup()
  }
})

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
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('resize', handleResize)
      
      // 保存清理函数
      cleanup = () => {
        observer.disconnect()
        window.removeEventListener('scroll', scrollHandler)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
      }

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

<style>
/* 确保这些样式不被 scoped 限制 */
.markdown-body pre {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: var(--code-block-bg);
  overflow-x: auto;
}

.markdown-body pre code {
  background: none;
  padding: 0;
  border-radius: 0;
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  color: var(--code-text);
}

.markdown-body code {
  background: var(--code-inline-bg);
  color: var(--code-text);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
  font-family: 'Fira Code', Consolas, Monaco, 'Andale Mono', monospace;
}

/* Light theme */
:root {
  --code-block-bg: #f8f9fc;
  --code-inline-bg: #f3f4f6;
  --code-text: #383a42;
  --header-height: 64px;
}

/* Dark theme */
.dark {
  --code-block-bg: #1e1e1e;
  --code-inline-bg: #2d2d2d;
  --code-text: #e5e7eb;
}

/* 代码高亮主题相关颜色 */
.hljs {
  background: transparent !important;
  color: inherit !important;
}

/* Light theme syntax colors - 增强对比度和美观性 */
:root {
  --syntax-comment: #a0a1a7;          /* 适中的灰色注释 */
  --syntax-keyword: #a626a4;          /* 紫色关键字 */
  --syntax-string: #50a14f;           /* 绿色字符串 */
  --syntax-number: #986801;           /* 金色数字 */
  --syntax-function: #4078f2;         /* 蓝色函数名 */
  --syntax-class: #c18401;            /* 橙色类名 */
  --syntax-title: #4078f2;            /* 蓝色标题 */
  --syntax-params: #383a42;           /* 深灰色参数 */
  --syntax-variable: #e45649;         /* 红色变量 */
  --syntax-operator: #383a42;         /* 深灰色运算符 */
  --syntax-property: #0184bc;         /* 青色属性 */
  --syntax-punctuation: #383a42;      /* 深灰色标点 */
}

/* Dark theme syntax colors */
.dark {
  --syntax-comment: #6a737d;
  --syntax-keyword: #ff7b72;
  --syntax-string: #a5d6ff;
  --syntax-number: #79c0ff;
  --syntax-function: #d2a8ff;
  --syntax-class: #7ee787;
  --syntax-title: #d2a8ff;
  --syntax-params: #e5e7eb;
  --syntax-variable: #ffa657;
  --syntax-operator: #79c0ff;
  --syntax-property: #79c0ff;
  --syntax-punctuation: #e5e7eb;
}

/* 语法高亮规则 */
:deep(.hljs-type),
:deep(.hljs-class),
:deep(.hljs-title.class_),
:deep(.hljs-title.function_) {
  color: var(--syntax-class) !important;
}

:deep(.hljs-name),
:deep(.hljs-function),
:deep(.hljs-title.function_) {
  color: var(--syntax-function) !important;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-built_in) {
  color: var(--syntax-keyword) !important;
}

:deep(.hljs-string),
:deep(.hljs-attr),
:deep(.hljs-string) {
  color: var(--syntax-string) !important;
}

:deep(.hljs-number),
:deep(.hljs-literal) {
  color: var(--syntax-number) !important;
}

:deep(.hljs-variable),
:deep(.hljs-template-variable) {
  color: var(--syntax-variable) !important;
}

:deep(.hljs-comment) {
  color: var(--syntax-comment) !important;
}

:deep(.hljs-doctag) {
  color: var(--syntax-keyword) !important;
}

:deep(.hljs-params) {
  color: var(--syntax-params) !important;
}

:deep(.hljs-property) {
  color: var(--syntax-property) !important;
}

:deep(.hljs-operator),
:deep(.hljs-punctuation) {
  color: var(--syntax-punctuation) !important;
}

/* 特殊处理一些语言特定的语法 */
.hljs-attr { color: var(--syntax-property) !important; }
.hljs-built_in { color: var(--syntax-keyword) !important; }
.hljs-literal { color: var(--syntax-keyword) !important; }
.hljs-type { color: var(--syntax-class) !important; }
.hljs-meta { color: var(--syntax-keyword) !important; }
.hljs-selector-tag { color: var(--syntax-keyword) !important; }
.hljs-selector-class { color: var(--syntax-class) !important; }
.hljs-selector-id { color: var(--syntax-class) !important; }
.hljs-selector-attr { color: var(--syntax-variable) !important; }
.hljs-selector-pseudo { color: var(--syntax-variable) !important; }
.hljs-template-tag { color: var(--syntax-keyword) !important; }
.hljs-template-variable { color: var(--syntax-variable) !important; }
</style>

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
  gap: 1.5rem;
  color: var(--text-tertiary);
  font-size: 0.9rem;
  margin: 1rem 0;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
}

.meta-item svg {
  flex-shrink: 0;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0;
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #3b82f6;
  background-color: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.3);
  transition: all 0.2s ease;
  font-weight: 500;
  cursor: pointer;
}

.tag:hover {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.dark .tag {
  color: #60a5fa;
  background-color: rgba(96, 165, 250, 0.05);
  border-color: rgba(96, 165, 250, 0.3);
}

.dark .tag:hover {
  background-color: rgba(96, 165, 250, 0.1);
  border-color: rgba(96, 165, 250, 0.5);
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
    display: none;  /* 在移动端完全隐藏原始目录 */
  }

  .article-title {
    font-size: 2rem !important;
  }

  .article-meta {
    flex-direction: column;
    gap: 0.75rem;
  }

  .meta-item {
    font-size: 0.85rem;
  }

  .tag {
    font-size: 0.8rem;
    padding: 0.35rem 0.7rem;
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
  scroll-margin-top: calc(var(--header-height) + 24px);
}

:deep(.markdown-body p) {
  margin-bottom: 1rem;
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

/* 代码高亮主题相关颜色 */
:deep(.hljs) {
  background: transparent !important;
  padding: 0 !important;
  color: inherit;
}

:deep(.hljs-keyword),
:deep(.hljs-selector-tag),
:deep(.hljs-title),
:deep(.hljs-section) {
  color: #c678dd;
}

:deep(.hljs-string),
:deep(.hljs-selector-attr),
:deep(.hljs-selector-pseudo),
:deep(.hljs-regexp) {
  color: #98c379;
}

:deep(.hljs-literal),
:deep(.hljs-number) {
  color: #d19a66;
}

:deep(.hljs-variable),
:deep(.hljs-template-variable) {
  color: #e06c75;
}

:deep(.hljs-comment) {
  color: #7f848e;
}

:deep(.hljs-doctag) {
  color: #c678dd;
}

:deep(.hljs-function) {
  color: #61afef;
}

:deep(.hljs-params) {
  color: #e5c07b;
}

:deep(.hljs-built_in) {
  color: #e5c07b;
}

:deep(.hljs-class) {
  color: #e5c07b;
}

:deep(.hljs-property) {
  color: #e06c75;
}

:deep(.hljs-attr) {
  color: #d19a66;
}

:deep(.hljs-meta) {
  color: #7f848e;
}

:deep(.hljs-tag) {
  color: #e06c75;
}

:deep(.hljs-name) {
  color: #61afef;
}

:deep(.hljs-type) {
  color: #e5c07b;
}

:deep(.hljs-link) {
  color: #61afef;
  text-decoration: underline;
}

:deep(.hljs-emphasis) {
  font-style: italic;
}

:deep(.hljs-strong) {
  font-weight: bold;
}

:deep(.hljs-deletion) {
  color: #be5046;
}

:deep(.hljs-addition) {
  color: #98c379;
}

/* 暗色主题代码高亮 */
.dark :deep(.hljs) {
  color: #abb2bf;
}

.dark :deep(.hljs-keyword),
.dark :deep(.hljs-selector-tag),
.dark :deep(.hljs-title),
.dark :deep(.hljs-section) {
  color: #c678dd;
}

.dark :deep(.hljs-string),
.dark :deep(.hljs-selector-attr),
.dark :deep(.hljs-selector-pseudo),
.dark :deep(.hljs-regexp) {
  color: #98c379;
}

.dark :deep(.hljs-literal),
.dark :deep(.hljs-number) {
  color: #d19a66;
}

.dark :deep(.hljs-variable),
.dark :deep(.hljs-template-variable) {
  color: #e06c75;
}

.dark :deep(.hljs-comment) {
  color: #7f848e;
}

.dark :deep(.hljs-doctag) {
  color: #c678dd;
}

.dark :deep(.hljs-function) {
  color: #61afef;
}

.dark :deep(.hljs-params) {
  color: #e5c07b;
}

.dark :deep(.hljs-built_in) {
  color: #e5c07b;
}

.dark :deep(.hljs-class) {
  color: #e5c07b;
}

.dark :deep(.hljs-property) {
  color: #e06c75;
}

.dark :deep(.hljs-attr) {
  color: #d19a66;
}

.dark :deep(.hljs-meta) {
  color: #7f848e;
}

.dark :deep(.hljs-tag) {
  color: #e06c75;
}

.dark :deep(.hljs-name) {
  color: #61afef;
}

.dark :deep(.hljs-type) {
  color: #e5c07b;
}

.dark :deep(.hljs-link) {
  color: #61afef;
  text-decoration: underline;
}

.dark :deep(.hljs-emphasis) {
  font-style: italic;
}

.dark :deep(.hljs-strong) {
  font-weight: bold;
}

.dark :deep(.hljs-deletion) {
  color: #be5046;
}

.dark :deep(.hljs-addition) {
  color: #98c379;
}
</style>

<style scoped>
.floating-toc-button {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  z-index: 100;
  opacity: 0.9;  /* 稍微降低不透明度 */
}

.floating-toc-button:hover {
  transform: scale(1.05);
}

.mobile-toc-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;  /* 改为顶部对齐 */
  justify-content: center;
  z-index: 1000;
  padding-top: 2rem;  /* 添加顶部间距 */
}

.mobile-toc-content {
  background-color: var(--bg-primary);
  width: 90%;
  max-width: 400px;
  max-height: 80vh;
  border-radius: 12px;
  padding: 1rem;
  overflow-y: auto;
  margin-top: var(--header-height);  /* 考虑顶部导航栏的高度 */
}

.mobile-toc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.mobile-toc-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.close-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  color: var(--text-primary);
}

@media (max-width: 768px) {
  .toc-container:not(.mobile-toc) {
    display: none;
  }
}

/* 确保移动端目录样式正确 */
.mobile-toc-content .toc {
  padding: 0 0.5rem;
}

.mobile-toc-content .toc-item {
  padding: 0.5rem 0;
  font-size: 1rem;
}

/* 添加动画效果 */
.floating-toc-button {
  animation: fadeIn 0.3s ease;
}

.mobile-toc-modal {
  animation: fadeIn 0.2s ease;
}

.mobile-toc-content {
  animation: slideUp 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style> 