<template>
  <Transition name="fade">
    <div v-if="show" class="welcome-dialog-overlay" @click.self="closeDialog">
      <div class="welcome-dialog" :class="{ 'dark': isDark }">
        <div class="main-title">
          <div class="title-wrapper">
            <h1 class="site-title">{{ currentLanguage === 'zh' ? '欢迎来到黑盒!' : 'Welcome to BlackBox!' }}</h1>
            <button class="lang-switch" @click="toggleLanguage">
              {{ currentLanguage === 'zh' ? 'EN' : '中' }}
            </button>
          </div>
        </div>
        
        <div class="welcome-content">
          <div class="content-card">
            <p v-if="currentLanguage === 'zh'" class="welcome-text">
              这是我的个人博客平台。由于服务器配置限制，网站性能可能不如预期。如有不便，敬请谅解。
            </p>
            <template v-else>
              <p class="welcome-text">
                This is my blog platform. Due to server configuration limitations, website performance may not be optimal. We apologize for any inconvenience.
              </p>
              <div class="note-warning">
                <div class="note-icon">⚠️</div>
                <div class="note-content">
                  The website content is only available in Chinese. Please use translation software if needed.
                </div>
              </div>
            </template>
          </div>

          <!-- 公告区域 -->
          <div v-if="ANNOUNCEMENTS.length > 0" class="announcements-section">
            <div class="section-title">
              {{ currentLanguage === 'zh' ? '最新公告' : 'Announcements' }}
            </div>
            <div class="announcements-container">
              <template v-for="(announcement, index) in sortedAnnouncements" :key="index">
                <div class="announcement-item" :class="{ 'pinned': announcement.isPinned, 'version': announcement.icon === 'version' }">
                  <div class="announcement-icon" :class="[announcement.icon, { 'pinned': announcement.isPinned }]">
                    <!-- 版本更新 -->
                    <span v-if="announcement.icon === 'version'">🔄</span>
                    <!-- 警告/重要通知 -->
                    <span v-else-if="announcement.icon === 'warning'">⚠️</span>
                    <!-- 新功能 -->
                    <span v-else-if="announcement.icon === 'feature'">✨</span>
                    <!-- 维护通知 -->
                    <span v-else-if="announcement.icon === 'maintenance'">🔧</span>
                    <!-- 活动通知 -->
                    <span v-else-if="announcement.icon === 'event'">🎉</span>
                    <!-- 问题修复 -->
                    <span v-else-if="announcement.icon === 'bugfix'">🐛</span>
                    <!-- 安全更新 -->
                    <span v-else-if="announcement.icon === 'security'">🔒</span>
                    <!-- 性能优化 -->
                    <span v-else-if="announcement.icon === 'performance'">⚡</span>
                    <!-- 文档更新 -->
                    <span v-else-if="announcement.icon === 'docs'">📚</span>
                    <!-- 默认圆点 -->
                    <span v-else>•</span>
                  </div>
                  <div class="announcement-text">
                    {{ currentLanguage === 'zh' ? announcement.zh : announcement.en }}
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div class="welcome-footer">
          <label class="checkbox-container">
            <input 
              type="checkbox" 
              v-model="dontShowAgain"
              class="custom-checkbox"
            />
            <span class="checkbox-label">
              {{ currentLanguage === 'zh' ? '不再提醒' : "Don't show again" }}
            </span>
          </label>
          <button class="confirm-button" @click="closeDialog">
            {{ currentLanguage === 'zh' ? '确定' : 'Confirm' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useTheme } from '../composables/useTheme'
import { CURRENT_VERSION, ANNOUNCEMENTS } from '../config/announcement'

const { isDark } = useTheme()
const show = ref(false)
const dontShowAgain = ref(false)
const currentLanguage = ref('zh')

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'zh' ? 'en' : 'zh'
}

const closeDialog = () => {
  if (dontShowAgain.value) {
    localStorage.setItem('dontShowVersion', CURRENT_VERSION)
  }
  show.value = false
}

onMounted(() => {
  const dontShowVersion = localStorage.getItem('dontShowVersion')
  
  if (!dontShowVersion || dontShowVersion !== CURRENT_VERSION) {
    show.value = true
  }
})

// 对公告进行排序，固定公告始终在最上方
const sortedAnnouncements = computed(() => {
  return [...ANNOUNCEMENTS].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })
})
</script>

<style scoped>
.welcome-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 80px 20px 20px 20px;
  overflow-y: auto;
}

.welcome-dialog {
  background-color: var(--bg-card);
  border-radius: 20px;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  transform: translateY(0);
  transition: transform 0.3s ease;
  position: relative;
  overflow: hidden;
  margin: auto;
}

.welcome-dialog:hover {
  transform: translateY(-2px);
}

.main-title {
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  padding: 20px 32px;
  text-align: center;
}

.title-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
}

.site-title {
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -0.5px;
  line-height: 1.2;
  background: linear-gradient(135deg, #1a73e8, #3498db);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.lang-switch {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--text-primary);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.lang-switch:hover {
  background: #1a73e8;
  color: white;
  border-color: #1a73e8;
  transform: translateY(-1px);
}

.welcome-content {
  padding: 24px 32px;
}

.content-card {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--border-color);
  transition: transform 0.2s ease;
}

.content-card:hover {
  transform: translateY(-2px);
}

.welcome-text {
  margin: 0;
  line-height: 1.6;
  color: var(--text-primary);
  font-size: 0.95rem;
  white-space: pre-line;
}

.welcome-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-top: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.checkbox-container {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox {
  appearance: none;
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border: 2px solid #1a73e8;
  border-radius: 6px;
  background: var(--bg-card);
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.custom-checkbox:checked {
  background: #1a73e8;
  border-color: #1a73e8;
}

.custom-checkbox:checked::after {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.custom-checkbox:hover {
  border-color: #3498db;
}

.checkbox-label {
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
}

.confirm-button {
  padding: 12px 28px;
  background: linear-gradient(135deg, #1a73e8, #3498db);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(26, 115, 232, 0.2);
}

.confirm-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(26, 115, 232, 0.3);
  background: linear-gradient(135deg, #1557b0, #2980b9);
}

.confirm-button:active {
  transform: translateY(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 暗色模式样式 */
.dark .welcome-dialog {
  background-color: var(--bg-card);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.dark .content-card {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.dark .welcome-text {
  color: var(--text-primary);
}

.dark .checkbox-label {
  color: var(--text-secondary);
}

.dark .custom-checkbox {
  border-color: #1a73e8;
  background: var(--bg-card);
}

.dark .custom-checkbox:checked {
  background: #1a73e8;
}

.dark .custom-checkbox:hover {
  border-color: #3498db;
}

.announcements-section {
  margin-top: 16px;
  background: var(--bg-secondary);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.section-title {
  padding: 12px 20px;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-color);
  font-size: 0.95rem;
}

.announcements-container {
  max-height: 160px;
  overflow-y: auto;
  padding: 12px 20px;
}

.announcements-container::-webkit-scrollbar {
  width: 6px;
}

.announcements-container::-webkit-scrollbar-track {
  background: transparent;
}

.announcements-container::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 3px;
}

.announcements-container::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.announcement-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.announcement-item.pinned:not(.version) {
  background-color: var(--bg-warning);
  margin: 0 -12px;
  padding: 8px 12px;
  border-radius: 4px;
}

.announcement-item:not(:last-child) {
  border-bottom: 1px dashed var(--border-color);
}

.announcement-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 14px;
}

/* 版本更新 - 蓝色 */
.announcement-icon.version {
  color: var(--primary);
}

/* 警告/重要通知 - 红色 */
.announcement-icon.warning {
  color: var(--text-warning);
}

/* 新功能 - 蓝色 */
.announcement-icon.feature {
  color: var(--primary);
}

/* 维护通知 - 灰色 */
.announcement-icon.maintenance {
  color: var(--text-secondary);
}

/* 活动通知 - 黄色 */
.announcement-icon.event {
  color: #FFD700;
}

/* 问题修复 - 绿色 */
.announcement-icon.bugfix {
  color: #4CAF50;
}

/* 安全更新 - 紫色 */
.announcement-icon.security {
  color: #9C27B0;
}

/* 性能优化 - 橙色 */
.announcement-icon.performance {
  color: #FF9800;
}

/* 文档更新 - 蓝色 */
.announcement-icon.docs {
  color: var(--primary);
}

/* 置顶状态下的图标颜色 */
.announcement-icon.pinned:not(.version) {
  color: var(--text-warning);
}

.announcement-text {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--text-primary);
}

.pinned:not(.version) .announcement-text {
  color: var(--text-warning);
  font-weight: 500;
}

.note-warning {
  margin-top: 8px;
  padding: 8px 12px;
  background: var(--bg-warning);
  border-radius: 8px;
  border-left: 4px solid var(--text-warning);
  display: flex;
  gap: 6px;
  align-items: center;
  margin-left: 0;
  margin-right: auto;
  width: fit-content;
}

.note-icon {
  font-size: 0.95rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.note-content {
  color: var(--text-warning);
  font-weight: 500;
  margin: 0;
  line-height: 1.4;
  font-size: 0.9rem;
}

@media (max-width: 640px) {
  .main-title {
    padding: 16px 24px;
  }

  .site-title {
    font-size: 1.5rem;
  }

  .welcome-content {
    padding: 20px 24px;
  }

  .content-card {
    padding: 16px;
  }

  .welcome-text {
    font-size: 0.9rem;
  }

  .welcome-footer {
    padding: 20px 24px;
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .confirm-button {
    width: 100%;
  }

  .section-title {
    padding: 10px 16px;
    font-size: 0.9rem;
  }

  .welcome-dialog-overlay {
    padding: 60px 16px 16px 16px;
  }

  .announcements-container {
    max-height: 120px;
  }

  .announcement-item.pinned {
    margin: 0 -10px;
    padding: 8px 10px;
  }

  .note-warning {
    padding: 6px 10px;
    margin-top: 6px;
  }
}
</style> 