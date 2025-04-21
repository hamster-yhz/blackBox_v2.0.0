<template>
  <div class="home" :class="{ 'dark': isDark }">
    <header class="hero-section">
      <div class="carousel" :class="{ 'is-loading': isLoading }">
        <div v-if="isLoading" class="loading-overlay">
          <div class="loading-spinner"></div>
        </div>
        <div
          v-for="(image, index) in carouselImages"
          :key="index"
          class="carousel-item"
          :class="{ active: currentIndex === index }"
        >
          <img 
            :src="image" 
            :alt="`Hero image ${index + 1}`"
            @load="handleImageLoad(index)"
            class="carousel-image"
          />
          <div class="carousel-content">
            <h1 class="hero-title">黑盒</h1>
            <p class="hero-subtitle" :class="{ animate: isAnimating }" data-text="探索技术的奥秘，分享开发的乐趣">探索技术的奥秘，分享开发的乐趣</p>
          </div>
        </div>
      </div>
      <div class="carousel-dots">
        <div
          v-for="(_, index) in carouselImages"
          :key="index"
          class="dot"
          :class="{ active: currentIndex === index }"
          @click="setActiveImage(index)"
        ></div>
      </div>
    </header>

    <main class="main-content">
      <div class="latest-section">
        <h2 class="section-title">最新文章</h2>
        <ArticleList :limit="1" />
      </div>
      
      <div class="recommended-section" v-if="recommendedArticles.length > 0">
        <h2 class="section-title">推荐阅读</h2>
        <div class="recommended-articles">
          <article 
            v-for="article in recommendedArticles" 
            :key="article.id" 
            class="recommended-article"
          >
            <router-link :to="`/article/${article.id}`" class="article-link">
              <h3 class="article-title">{{ article.title }}</h3>
            </router-link>
            <div class="article-meta">
              <span class="article-date">{{ formatDate(article.date) }}</span>
              <span class="article-read-time">{{ article.readTime }}</span>
            </div>
            <p class="article-summary">{{ article.summary }}</p>
            <router-link :to="`/article/${article.id}`" class="read-more">
              阅读更多
            </router-link>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ArticleList from '../components/ArticleList.vue'
import { useTheme } from '../composables/useTheme'
import { useArticles } from '../composables/useArticles'
import type { Article } from '../utils/markdown'

const { isDark } = useTheme()
const { loadRecommendedArticles } = useArticles()
const recommendedArticles = ref<Article[]>([])

const carouselImages = [
  '/images/hero-1.jpeg',
  '/images/hero-2.jpeg',
  '/images/hero-3.jpeg'
]

const currentIndex = ref(0)
const isLoading = ref(true)
const loadedImages = ref(new Set<number>())
let timer: number | null = null
const isAnimating = ref(false)

const handleImageLoad = (index: number) => {
  loadedImages.value.add(index)
  if (loadedImages.value.size === carouselImages.length) {
    isLoading.value = false
  }
}

const setActiveImage = (index: number) => {
  currentIndex.value = index
  triggerAnimation()
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselImages.length
  triggerAnimation()
}

const triggerAnimation = () => {
  isAnimating.value = true
  setTimeout(() => {
    isAnimating.value = false
  }, 1000) // 动画持续1秒
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  } catch {
    return dateString
  }
}

onMounted(async () => {
  timer = window.setInterval(nextImage, 5000)
  
  // 加载推荐文章
  try {
    recommendedArticles.value = await loadRecommendedArticles()
  } catch (e) {
    console.error('Failed to load recommended articles:', e)
  }
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.hero-section {
  position: relative;
  width: 100%;
  height: 500px;
  min-height: 400px;
  max-width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.carousel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: inherit;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--overlay-color);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--spinner-color);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  overflow: hidden;
  border-radius: inherit;
}

.carousel-item.active {
  opacity: 1;
}

.carousel-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.7);
  overflow: hidden;
  border-radius: inherit;
}

.carousel-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #ffffff;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.95);
  position: relative;
  text-shadow: 
    1px 1px 0 rgba(0, 0, 0, 0.3),
    2px 2px 0 rgba(0, 0, 0, 0.2),
    3px 3px 0 rgba(0, 0, 0, 0.15),
    4px 4px 0 rgba(0, 0, 0, 0.1),
    5px 5px 0 rgba(0, 0, 0, 0.05);
  transform: perspective(800px) rotateX(3deg) translateZ(20px);
  transform-style: preserve-3d;
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  margin: 0;
  text-align: center;
  line-height: 1.5;
  position: relative;
}

.hero-subtitle::before,
.hero-subtitle::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  width: 100%;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  transition: transform 0.5s ease-in-out;
}

.hero-subtitle::before {
  clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
  transform: translateY(0);
}

.hero-subtitle::after {
  clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
  transform: translateY(0);
}

.hero-subtitle.animate::before {
  transform: translateY(-5px);
}

.hero-subtitle.animate::after {
  transform: translateY(5px);
}

.carousel-dots {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 3;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--dot-color);
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.dot.active {
  background: var(--dot-active-color);
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  padding-left: 1rem;
  border-left: 4px solid var(--primary-color);
}

.recommended-section {
  margin-bottom: 3rem;
}

.recommended-articles {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.recommended-article {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid var(--border-color);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recommended-article:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px var(--shadow-color);
  border-color: var(--primary-color-light);
}

.recommended-article .article-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  line-height: 1.4;
  transition: color 0.2s;
}

.recommended-article .article-title:hover {
  color: var(--primary-color);
}

.recommended-article .article-meta {
  display: flex;
  justify-content: space-between;
  color: var(--text-tertiary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.recommended-article .article-summary {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex-grow: 1;
}

.recommended-article .read-more {
  align-self: flex-start;
  color: var(--primary-color);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.recommended-article .read-more:hover {
  color: var(--primary-color-dark);
  text-decoration: underline;
}

.latest-section {
  margin-top: 2rem;
}

@media (max-width: 1024px) {
  .hero-section {
    max-width: 100%;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .hero-section {
    height: 400px;
    min-height: 300px;
    border-radius: 0;
  }
  
  .recommended-articles {
    grid-template-columns: 1fr;
  }
  
  .section-title {
    font-size: 1.25rem;
  }
  
  .recommended-article .article-title {
    font-size: 1.125rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .hero-subtitle::before,
  .hero-subtitle::after {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 300px;
  }
  
  .carousel-content {
    padding: 1rem;
  }
}

/* Dark mode styles */
.dark .home {
  background-color: var(--bg-primary-dark);
}

.dark .hero-section {
  box-shadow: 0 4px 12px var(--shadow-color-dark);
}

.dark .loading-overlay {
  background: var(--overlay-color-dark);
}

.dark .loading-spinner {
  border-color: var(--spinner-color-dark);
  border-top-color: transparent;
}

.dark .dot {
  background: var(--dot-color-dark);
}

.dark .dot.active {
  background: var(--dot-active-color-dark);
}

/* CSS Variables */
:root {
  --bg-primary: #f5f5f5;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --overlay-color: rgba(0, 0, 0, 0.1);
  --spinner-color: #ffffff;
  --dot-color: rgba(255, 255, 255, 0.5);
  --dot-active-color: #ffffff;
}

.dark {
  --bg-primary-dark: #1a1a1a;
  --shadow-color-dark: rgba(0, 0, 0, 0.3);
  --overlay-color-dark: rgba(0, 0, 0, 0.3);
  --spinner-color-dark: #ffffff;
  --dot-color-dark: rgba(255, 255, 255, 0.3);
  --dot-active-color-dark: #ffffff;
}
</style> 