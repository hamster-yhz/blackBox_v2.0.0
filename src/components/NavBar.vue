<template>
  <header class="navbar" :class="{ 'dark': isDark }">
    <div class="navbar-container">
      <div class="navbar-left">
        <router-link to="/" class="logo">
          <div class="logo-icon-wrapper" @click="createParticles($event)">
            <img src="/logo.svg" alt="BlackBox Logo" class="logo-image" />
          </div>
          <span class="brand-text">BlackBox</span>
        </router-link>
      </div>

      <!-- 桌面端导航 -->
      <nav class="desktop-nav">
        <router-link 
          v-for="(link, index) in navLinks" 
          :key="index"
          :to="link.to"
          class="nav-link"
        >
          {{ link.text }}
        </router-link>
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

const navLinks = [
  { to: '/', text: '首页' },
  { to: '/categories', text: '分类' },
  { to: '/archive', text: '归档' },
  { to: '/about', text: '关于' }
]

const createParticles = (event: MouseEvent) => {
  const button = event.currentTarget as HTMLElement
  const rect = button.getBoundingClientRect()
  
  // 获取鼠标点击位置相对于按钮的位置
  const clickX = event.offsetX
  const clickY = event.offsetY
  
  // 创建粒子容器
  const particlesContainer = document.createElement('div')
  particlesContainer.style.position = 'absolute'
  particlesContainer.style.pointerEvents = 'none'
  particlesContainer.style.width = '100%'
  particlesContainer.style.height = '100%'
  particlesContainer.style.top = '0'
  particlesContainer.style.left = '0'
  particlesContainer.style.overflow = 'visible'
  button.appendChild(particlesContainer)

  // 创建烟花粒子
  for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div')
    particle.style.position = 'absolute'
    particle.style.width = '4px'
    particle.style.height = '4px'
    particle.style.backgroundColor = '#3b82f6'
    particle.style.borderRadius = '50%'
    particle.style.opacity = '0.8'
    
    // 计算角度和距离
    const angle = (Math.random() * Math.PI * 2)
    const distance = Math.random() * 60 + 30 // 调整扩散距离
    
    // 计算最终位置
    const x = clickX + Math.cos(angle) * distance
    const y = clickY + Math.sin(angle) * distance
    
    // 设置初始位置
    particle.style.left = `${clickX}px`
    particle.style.top = `${clickY}px`
    
    // 添加拖尾效果
    const trail = document.createElement('div')
    trail.style.position = 'absolute'
    trail.style.width = '2px'
    trail.style.height = '2px'
    trail.style.backgroundColor = '#3b82f6'
    trail.style.borderRadius = '50%'
    trail.style.opacity = '0.4'
    trail.style.left = `${clickX}px`
    trail.style.top = `${clickY}px`
    
    particlesContainer.appendChild(particle)
    particlesContainer.appendChild(trail)
    
    // 粒子动画
    const particleAnimation = particle.animate([
      { 
        transform: 'translate(0, 0) scale(1)',
        opacity: 0.8
      },
      { 
        transform: `translate(${x - clickX}px, ${y - clickY}px) scale(0.5)`,
        opacity: 0
      }
    ], {
      duration: 800,
      easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)'
    })
    
    // 拖尾动画
    const trailAnimation = trail.animate([
      { 
        transform: 'translate(0, 0) scale(1)',
        opacity: 0.4
      },
      { 
        transform: `translate(${(x - clickX) * 0.7}px, ${(y - clickY) * 0.7}px) scale(0.3)`,
        opacity: 0
      }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)'
    })
    
    // 清理
    particleAnimation.onfinish = () => {
      particle.remove()
      if (particlesContainer.children.length === 0) {
        particlesContainer.remove()
      }
    }
    
    trailAnimation.onfinish = () => {
      trail.remove()
      if (particlesContainer.children.length === 0) {
        particlesContainer.remove()
      }
    }
  }

  // 创建额外的随机粒子
  for (let i = 0; i < 15; i++) {
    const extraParticle = document.createElement('div')
    extraParticle.style.position = 'absolute'
    extraParticle.style.width = '3px'
    extraParticle.style.height = '3px'
    extraParticle.style.backgroundColor = '#3b82f6'
    extraParticle.style.borderRadius = '50%'
    extraParticle.style.opacity = '0.6'
    
    // 更随机的角度和距离
    const angle = (Math.random() * Math.PI * 2)
    const distance = Math.random() * 40 + 20
    
    const x = clickX + Math.cos(angle) * distance
    const y = clickY + Math.sin(angle) * distance
    
    extraParticle.style.left = `${clickX}px`
    extraParticle.style.top = `${clickY}px`
    
    particlesContainer.appendChild(extraParticle)
    
    const animation = extraParticle.animate([
      { 
        transform: 'translate(0, 0) scale(1)',
        opacity: 0.6
      },
      { 
        transform: `translate(${x - clickX}px, ${y - clickY}px) scale(0.3)`,
        opacity: 0
      }
    ], {
      duration: 600 + Math.random() * 400,
      easing: 'cubic-bezier(0.1, 0.7, 0.1, 1)'
    })
    
    animation.onfinish = () => {
      extraParticle.remove()
      if (particlesContainer.children.length === 0) {
        particlesContainer.remove()
      }
    }
  }

  // 确保容器在动画结束后被移除
  setTimeout(() => {
    if (particlesContainer && particlesContainer.parentNode) {
      particlesContainer.remove()
    }
  }, 1000)
}

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 2rem;
  transition: color 0.3s ease;
}

.logo-icon-wrapper {
  position: relative;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.logo-icon-wrapper:hover {
  background-color: rgba(59, 130, 246, 0.1);
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}

.logo-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.logo-icon-wrapper:hover::before {
  opacity: 1;
}

.logo-image {
  height: 2rem;
  width: auto;
  color: var(--text-primary);
  transition: all 0.3s ease;
  filter: drop-shadow(0 0 0 rgba(59, 130, 246, 0));
}

.logo-icon-wrapper:hover .logo-image {
  filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.5));
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.desktop-nav {
  display: flex;
  gap: 2rem;
  margin-right: auto;
}

.desktop-nav a {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  font-size: 0.95rem;
}

.desktop-nav a:hover {
  color: var(--text-hover);
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
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
    margin-left: auto;
  }

  .search-box {
    display: none;
  }

  .navbar-right {
    gap: 0.5rem;
    margin-left: auto;
    display: flex;
    align-items: center;
  }

  .navbar-container {
    justify-content: space-between;
  }

  .navbar-left {
    margin-right: auto;
  }
}

/* 移除暗色模式下的重复样式 */
.dark .navbar {
  background-color: var(--bg-card);
  box-shadow: var(--shadow-sm);
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

.dark .logo-image {
  color: var(--text-primary);
}

.nav-link {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: var(--text-hover);
}
</style> 