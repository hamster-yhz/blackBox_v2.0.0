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
            <h1 class="hero-title">黑盒博客</h1>
            <p class="hero-subtitle">探索技术的奥秘，分享开发的乐趣</p>
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
      <ArticleList :limit="3" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ArticleList from '../components/ArticleList.vue'
import { useTheme } from '../composables/useTheme'

const { isDark } = useTheme()

const carouselImages = [
  '/images/hero-1.jpeg',
  '/images/hero-2.jpeg',
  '/images/hero-3.jpeg'
]

const currentIndex = ref(0)
const isLoading = ref(true)
const loadedImages = ref(new Set<number>())
let timer: number | null = null

const handleImageLoad = (index: number) => {
  loadedImages.value.add(index)
  if (loadedImages.value.size === carouselImages.length) {
    isLoading.value = false
  }
}

const setActiveImage = (index: number) => {
  currentIndex.value = index
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselImages.length
}

onMounted(() => {
  timer = window.setInterval(nextImage, 5000)
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
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-subtitle {
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  max-width: 600px;
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
  margin: 2rem auto;
  padding: 0 1rem;
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