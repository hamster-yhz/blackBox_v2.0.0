<template>
  <div class="about">
    <div class="about-content">
      <h1>关于黑盒博客</h1>
      <p>黑盒博客是一个专注于技术分享和学习的个人博客平台。在这里，我们将探索各种技术领域的知识，分享开发经验和心得。</p>
      
      <h2>技术栈</h2>
      <ul>
        <li>前端框架：Vue 3</li>
        <li>构建工具：Vite</li>
        <li>样式方案：CSS Variables</li>
        <li>Markdown 支持</li>
        <li>响应式设计</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.about-content {
  background: var(--bg-secondary);
  padding: 2rem;
  border-radius: 12px;
}

h1 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 2rem;
}

h2 {
  color: var(--text-primary);
  margin: 2rem 0 1rem;
  font-size: 1.5rem;
}

p {
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  color: var(--text-secondary);
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
}

li::before {
  content: "•";
  color: var(--primary-color);
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .about {
    padding: 1rem;
  }
  
  .about-content {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
}
</style> 