<template>
  <div class="home">
    <header class="hero-section">
      <div class="carousel">
        <div
          v-for="(image, index) in carouselImages"
          :key="index"
          class="carousel-item"
          :class="{ active: currentIndex === index }"
          :style="{ backgroundImage: `url(${image})` }"
        >
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

    <main>
      <ArticleList />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import ArticleList from '../components/ArticleList.vue'

const carouselImages = [
  '/images/hero-1.jpeg',
  '/images/hero-2.jpeg',
  '/images/hero-3.jpeg'
]

const currentIndex = ref(0)
let timer: number | null = null

const setActiveImage = (index: number) => {
  currentIndex.value = index
}

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % carouselImages.length
}

onMounted(() => {
  // 自动轮播，每5秒切换一次
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.carousel {
  position: absolute;
  width: 100%;
  height: 100%;
}

.carousel-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.carousel-item.active {
  opacity: 1;
}

.carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
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
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #ffffff;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.9);
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
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #ffffff;
  transform: scale(1.2);
}

@media (max-width: 768px) {
  .hero-section {
    margin: 0;
    height: 400px;
    min-height: 300px;
    border-radius: 0;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.2rem;
  }
}
</style> 