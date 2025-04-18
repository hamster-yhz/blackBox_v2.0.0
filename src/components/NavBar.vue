<template>
  <header class="navbar" :class="{ 'dark': isDark }">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo">
          黑盒博客
        </router-link>
      </div>

      <!-- 桌面端导航 -->
      <nav class="desktop-nav">
        <router-link to="/">首页</router-link>
        <router-link to="/categories">分类</router-link>
        <router-link to="/about">关于</router-link>
      </nav>

      <div class="navbar-right">
        <!-- 搜索框 -->
        <SearchBox class="search-box" />
        
        <!-- 主题切换 -->
        <ThemeToggle />
        
        <!-- 移动端菜单 -->
        <MobileMenu class="mobile-menu-wrapper" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import ThemeToggle from './ThemeToggle.vue'
import MobileMenu from './MobileMenu.vue'
import SearchBox from './SearchBox.vue'

const { isDark } = useTheme()
</script>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 0;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 3rem;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
}

.logo:hover {
  color: var(--primary-color);
}

.desktop-nav {
  display: flex;
  gap: 2rem;
}

.desktop-nav a {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}

.desktop-nav a:hover,
.desktop-nav a.router-link-active {
  color: var(--primary-color);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  width: 300px;
}

/* 调整媒体查询断点 */
@media (max-width: 1024px) {
  .search-box {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .search-box {
    display: none;
  }

  .mobile-menu-wrapper {
    display: block;
  }
}

@media (min-width: 769px) {
  .mobile-menu-wrapper {
    display: none;
  }
}

/* 暗色模式样式 */
.dark .navbar {
  background: var(--bg-primary);
  border-bottom-color: var(--border-color);
}

.dark .logo {
  color: var(--text-primary);
}

.dark .desktop-nav a {
  color: var(--text-primary);
}

.dark .desktop-nav a:hover,
.dark .desktop-nav a.router-link-active {
  color: var(--primary-color);
}
</style> 