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
        
        <template v-if="!isAuthenticated">
          <router-link to="/login" @click="closeMenu" class="login-link">
            登录
          </router-link>
        </template>
        <template v-else>
          <router-link to="/admin" @click="closeMenu" class="admin-link">
            管理
          </router-link>
          <button @click="handleLogout" class="logout-button">
            退出登录
          </button>
        </template>
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
import { useAuth } from '../api/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { isAuthenticated, logout } = useAuth()
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

const handleLogout = () => {
  logout()
  closeMenu()
  router.push('/')
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
    height: 2px;
    background: var(--text-primary);
    border-radius: 10px;
    transition: all 0.3s linear;
    position: relative;
    transform-origin: 1px;
  }

  .hamburger.is-active span:nth-child(1) {
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
    right: -100%;
    width: 80%;
    max-width: 300px;
    height: 100vh;
    background: var(--bg-primary);
    padding: 2rem 1rem;
    transition: right 0.3s ease;
    z-index: 1000;
    display: flex;
    flex-direction: column;
  }

  .menu-content.is-open {
    right: 0;
  }

  .menu-content nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .menu-content a,
  .menu-content button {
    color: var(--text-primary);
    text-decoration: none;
    padding: 0.5rem 0;
    font-size: 1rem;
    transition: color 0.2s;
  }

  .menu-content a:hover,
  .menu-content button:hover {
    color: var(--text-hover);
  }

  .login-link,
  .admin-link {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background: var(--primary-color);
    color: white;
    text-align: center;
  }

  .logout-button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    background: var(--danger-color);
    color: white;
    text-align: center;
    width: 100%;
    border: none;
    cursor: pointer;
  }

  .mobile-search {
    margin-bottom: 1rem;
  }

  .menu-footer {
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid var(--border-color);
  }

  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
}

@media (min-width: 769px) {
  .mobile-menu-wrapper {
    display: none !important;
  }
}
</style> 