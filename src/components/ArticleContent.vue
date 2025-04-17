<template>
  <div class="article-container" :class="{ 'dark': isDark }">
    <div class="article-content">
      <div class="markdown-body" v-html="renderedContent" ref="articleRef"></div>
    </div>
    
    <div class="toc-container" v-if="toc.length > 0">
      <div class="toc-title">目录</div>
      <nav class="toc">
        <a
          v-for="item in toc"
          :key="item.id"
          :href="'#' + item.id"
          class="toc-item"
          :class="{
            'active': activeHeading === item.id,
            [`level-${item.level}`]: true
          }"
          @click="handleTocClick($event, item.id)"
        >
          {{ item.text }}
        </a>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { marked } from 'marked'
import type { Renderer, Token } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { useTheme } from '../composables/useTheme'

const props = defineProps<{
  content: string
}>()

const articleRef = ref<HTMLElement | null>(null)
const toc = ref<Array<{ id: string; text: string; level: number }>>([])
const activeHeading = ref('')
const { isDark } = useTheme()

// 配置 marked
const renderer: Partial<Renderer> = {
  heading({ tokens, depth }: { tokens: Token[]; depth: number }): string {
    const text = tokens.map((token: Token) => {
      if ('text' in token) {
        return token.text
      }
      return ''
    }).join('')
    const id = text.toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `<h${depth} id="${id}">${text}</h${depth}>`
  }
}

marked.use({ renderer })

// 渲染 Markdown 内容
const renderedContent = ref('')

// 生成目录
function generateToc(content: string) {
  const headings = content.match(/^#{1,6}\s+.+$/gm) || []
  toc.value = headings.map(heading => {
    const level = heading.match(/^#+/)?.[0].length || 1
    const text = heading.replace(/^#+\s+/, '')
    const id = text.toLowerCase()
      .trim()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return { id, text, level }
  })
}

// 处理内容渲染
async function processContent() {
  if (!props.content) return
  generateToc(props.content)
  
  try {
    const html = await marked(props.content)
    renderedContent.value = html
    
    nextTick(() => {
      if (articleRef.value) {
        const codeBlocks = articleRef.value.querySelectorAll('pre code')
        codeBlocks.forEach((block) => {
          hljs.highlightElement(block as HTMLElement)
        })
      }
      updateActiveHeading()
      addHeadingClickHandlers()
    })
  } catch (e) {
    console.error('Error rendering markdown:', e)
    renderedContent.value = '内容渲染失败'
  }
}

// 处理目录点击
function handleTocClick(event: MouseEvent, id: string) {
  event.preventDefault()
  scrollToHeading(id)
}

// 滚动到指定标题
function scrollToHeading(id: string) {
  const element = document.getElementById(id)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top + window.scrollY
    const offsetPosition = elementPosition - offset
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
    activeHeading.value = id
    
    // 更新 URL hash，但不触发滚动
    history.pushState(null, '', `#${id}`)
  }
}

// 为所有标题添加点击事件处理
function addHeadingClickHandlers() {
  if (!articleRef.value) return
  
  const headings = articleRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  headings.forEach(heading => {
    const htmlHeading = heading as HTMLElement
    if (!htmlHeading.dataset.hasClickHandler) {
      htmlHeading.addEventListener('click', () => {
        if (htmlHeading.id) {
          scrollToHeading(htmlHeading.id)
        }
      })
      htmlHeading.style.cursor = 'pointer'
      htmlHeading.dataset.hasClickHandler = 'true'
    }
  })
}

// 监听滚动更新当前标题
function updateActiveHeading() {
  if (!articleRef.value) return

  const headings = articleRef.value.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const scrollPosition = window.scrollY

  let currentHeading = ''
  for (const heading of Array.from(headings)) {
    const id = heading.id
    const offset = heading.getBoundingClientRect().top + window.scrollY - 100

    if (scrollPosition >= offset) {
      currentHeading = id
    }
  }
  
  if (currentHeading) {
    activeHeading.value = currentHeading
  }
}

// 监听内容变化
watch(() => props.content, async () => {
  await processContent()
}, { immediate: true })

onMounted(() => {
  window.addEventListener('scroll', updateActiveHeading)
  
  // 检查 URL hash 并滚动到对应位置
  nextTick(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      scrollToHeading(hash)
    }
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveHeading)
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

.level-1 { padding-left: 0; }
.level-2 { padding-left: 1rem; }
.level-3 { padding-left: 2rem; }
.level-4 { padding-left: 3rem; }
.level-5 { padding-left: 4rem; }
.level-6 { padding-left: 5rem; }

@media (max-width: 768px) {
  .article-container {
    flex-direction: column;
  }

  .toc-container {
    position: relative;
    top: 0;
    width: 100%;
    margin-bottom: 2rem;
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
}

:deep(.markdown-body p) {
  margin-bottom: 1rem;
}

:deep(.markdown-body code) {
  background: var(--code-bg);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
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
</style> 