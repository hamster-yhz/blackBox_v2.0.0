<template>
  <div class="mobile-menu-wrapper">
    <!-- 汉堡菜单按钮 -->
    <button
      class="hamburger"
      :class="{ 'is-active': isOpen }"
      @click.stop="toggleMenu"
      aria-label="菜单"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- 菜单内容 -->
    <div
      v-show="isOpen"
      class="menu-content"
      :class="{ 'is-open': isOpen }"
      @click.stop
      v-click-outside="closeMenu"
    >
      <nav>
        <SearchBox class="mobile-search" />
        <router-link to="/" @click="closeMenu">首页</router-link>
        <router-link to="/categories" @click="closeMenu">分类</router-link>
        <router-link to="/about" @click="closeMenu">关于</router-link>
      </nav>
      <div class="menu-footer">
        <ThemeToggle />
      </div>
    </div>

    <!-- 背景遮罩 -->
    <div
      v-show="isOpen"
      class="menu-overlay"
      @click="closeMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import SearchBox from './SearchBox.vue'
import { vClickOutside } from '../directives/clickOutside'

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  if (isOpen.value) {
    isOpen.value = false
    document.body.style.overflow = ''
  }
}

// 确保在组件卸载时恢复 body 的滚动
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<style scoped>
.mobile-menu-wrapper {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu-wrapper {
    display: block;
    position: relative;
    z-index: 1000;
  }

  .hamburger {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 2rem;
    height: 2rem;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 1001;
  }

  .hamburger span {
    display: block;
    width: 2rem;
    height: 0.25rem;
    background: var(--text-primary);
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: center;
  }

  .hamburger.is-active span:first-child {
    transform: translateY(0.7rem) rotate(45deg);
  }

  .hamburger.is-active span:nth-child(2) {
    opacity: 0;
    transform: translateX(-100%);
  }

  .hamburger.is-active span:nth-child(3) {
    transform: translateY(-0.7rem) rotate(-45deg);
  }

  .menu-content {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: var(--bg-primary);
    display: flex;
    flex-direction: column;
    padding: 5rem 2rem;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    transform: translateX(-100%);
    opacity: 0;
    z-index: 1000;
    overflow-y: auto;
  }

  .menu-content.is-open {
    transform: translateX(0);
    opacity: 1;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  nav a {
    color: var(--text-primary);
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.3s;
    padding: 0.5rem 0;
  }

  nav a:hover,
  nav a.router-link-active {
    color: var(--primary-color);
  }

  .menu-footer {
    margin-top: auto;
    display: flex;
    justify-content: center;
    padding: 2rem 0;
    border-top: 1px solid var(--border-color);
  }

  .mobile-search {
    margin-bottom: 2rem;
    width: 100%;
  }

  /* 暗色模式样式 */
  .dark .menu-content {
    background: var(--bg-primary);
  }

  .dark .hamburger span {
    background: var(--text-primary);
  }

  .dark .menu-footer {
    border-top-color: var(--border-color);
  }
}

@media (min-width: 769px) {
  .mobile-menu-wrapper {
    display: none !important;
  }
}

.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.menu-overlay.is-open {
  opacity: 1;
}
</style> 