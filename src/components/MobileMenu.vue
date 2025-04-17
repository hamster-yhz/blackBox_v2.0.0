<template>
  <div class="mobile-menu">
    <!-- 汉堡菜单按钮 -->
    <button
      class="hamburger"
      :class="{ 'is-active': isOpen }"
      @click="toggleMenu"
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
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
</script>

<style scoped>
.mobile-menu {
  display: none;
}

@media (max-width: 768px) {
  .mobile-menu {
    display: block;
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
    z-index: 1000;
  }

  .hamburger span {
    width: 2rem;
    height: 0.25rem;
    background: var(--text-primary);
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }

  .hamburger.is-active span:first-child {
    transform: rotate(45deg);
  }

  .hamburger.is-active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.is-active span:nth-child(3) {
    transform: rotate(-45deg);
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
    transition: transform 0.3s ease-in-out;
    transform: translateX(-100%);
    z-index: 999;
  }

  .menu-content.is-open {
    transform: translateX(0);
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  nav a {
    color: var(--text-primary);
    text-decoration: none;
    font-size: 1.5rem;
    transition: color 0.3s;
  }

  nav a:hover,
  nav a.router-link-active {
    color: var(--primary-color);
  }

  .menu-footer {
    margin-top: auto;
    display: flex;
    justify-content: center;
  }

  .mobile-search {
    margin-bottom: 2rem;
    width: 100%;
  }
}
</style> 