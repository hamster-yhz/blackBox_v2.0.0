interface Announcement {
  zh: string;
  en: string;
  isPinned?: boolean; // 是否固定在顶部
  icon?: string; // 图标标识，可选值如下：
  // 🔄 version: 版本更新
  // ⚠️ warning: 警告/重要通知
  // ✨ feature: 新功能
  // 🔧 maintenance: 维护通知
  // 🎉 event: 活动通知
  // 🐛 bugfix: 问题修复
  // 🔒 security: 安全更新
  // ⚡ performance: 性能优化
  // 📚 docs: 文档更新
}

export const CURRENT_VERSION = '2.0.3'

// 版本更新内容
export const VERSION_UPDATES = {
  zh: '新增了公告支持',
  en: 'added announcement support'
}

// 生成版本更新公告
const getVersionAnnouncement = (): Announcement => ({
  zh: `网站已更新到 v${CURRENT_VERSION} 版本，${VERSION_UPDATES.zh}。`,
  en: `Website has been updated to v${CURRENT_VERSION}, ${VERSION_UPDATES.en}.`,
  isPinned: true,
  icon: 'version' // 🔄 版本更新
})

export const ANNOUNCEMENTS: Announcement[] = [
  // 固定在顶部的版本更新公告
  getVersionAnnouncement(),
  // 最新公告放在这里
  {
    zh: '针对美国地区访问黑盒网站将额外收取125%关税，具体费用将在您的账单中体现。此举措是对等贸易原则的体现。',
    en: 'A 125% tariff will be applied to US visitors accessing the BlackBox website. The fee will be reflected in your bill. This measure reflects the principle of reciprocal trade.',
    icon: 'warning' // ⚠️ 警告/重要通知
  },
  {
    zh: '黑盒网站正式上线！本网站提供以下功能：\n1. 文章发布与阅读\n2. 文章分类管理\n3. 暗色主题支持\n4. 中英文切换\n5. 公告系统\n6. 响应式设计，支持移动端访问',
    en: 'BlackBox website is now officially launched! The website provides the following features:\n1. Article publishing and reading\n2. Article category management\n3. Dark theme support\n4. Chinese/English language switching\n5. Announcement system\n6. Responsive design, supporting mobile access',
    icon: 'feature' // ✨ 新功能
  }
] 