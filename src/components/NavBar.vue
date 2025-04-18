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

        <div v-if="!isAuthenticated" class="flex items-center">
          <button
            @click="$router.push('/login')"
            class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            登录
          </button>
        </div>
        <div v-else class="flex items-center space-x-4">
          <router-link
            to="/admin"
            class="text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400"
          >
            管理
          </router-link>
          <button
            @click="handleLogout"
            class="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            退出登录
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useTheme } from '../composables/useTheme'
import ThemeToggle from './ThemeToggle.vue'
import MobileMenu from './MobileMenu.vue'
import SearchBox from './SearchBox.vue'
import { useAuth } from '../api/auth'
import { useRouter } from 'vue-router'

const { isDark } = useTheme()
const router = useRouter()
const { isAuthenticated, logout } = useAuth()

const navigation = [
  { name: '首页', path: '/' },
  { name: '分类', path: '/categories' },
  { name: '关于', path: '/about' },
]

const handleLogout = () => {
  logout()
  router.push('/')
}
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
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
}

.desktop-nav {
  display: flex;
  gap: 1.5rem;
}

.desktop-nav a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.desktop-nav a:hover {
  color: var(--text-hover);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-box {
  margin-right: 1rem;
}

.mobile-menu-wrapper {
  display: none;
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu-wrapper {
    display: block;
  }

  .search-box {
    display: none;
  }

  .navbar-right {
    gap: 0.5rem;
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

.dark .desktop-nav a:hover {
  color: var(--text-hover);
}
</style> 