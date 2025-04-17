import { ref } from 'vue'

interface Article {
  id: string
  title: string
  summary: string
  content: string
  createdAt: string
  category: string
  tags: string[]
  readTime?: string
}

// 模拟文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Vue 3 组合式 API 完全指南',
    summary: '深入探讨 Vue 3 组合式 API 的使用方法和最佳实践...',
    content: `# Vue 3 组合式 API 完全指南

## 什么是组合式 API？

组合式 API (Composition API) 是 Vue 3 中新增的一种编写组件逻辑的方式。它允许我们使用导入的 API 函数来描述组件逻辑，而不是在选项对象中声明选项。

## 为什么需要组合式 API？

传统的选项式 API 在组织复杂组件逻辑时存在一些限制：

- 相关的代码被分散在不同的选项中
- 难以复用逻辑
- TypeScript 支持有限

\`\`\`typescript
// 选项式 API
export default {
  data() {
    return {
      count: 0
    }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}

// 组合式 API
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    
    function increment() {
      count.value++
    }

    return {
      count,
      increment
    }
  }
}
\`\`\`

## 核心概念

### ref 和 reactive

\`ref\` 用于基础类型：

\`\`\`typescript
const count = ref(0)
console.log(count.value) // 0
\`\`\`

\`reactive\` 用于对象：

\`\`\`typescript
const state = reactive({
  count: 0,
  message: 'Hello'
})
console.log(state.count) // 0
\`\`\`

### 生命周期钩子

组合式 API 提供了一套对应的生命周期钩子：

\`\`\`typescript
import { onMounted, onUnmounted } from 'vue'

export default {
  setup() {
    onMounted(() => {
      console.log('组件已挂载')
    })

    onUnmounted(() => {
      console.log('组件已卸载')
    })
  }
}
\`\`\`

## 最佳实践

1. 使用 \`<script setup>\` 语法
2. 合理拆分组合式函数
3. 保持响应式引用的一致性
`,
    createdAt: '2024-03-20',
    category: 'frontend',
    tags: ['vue', 'javascript', 'composition-api'],
    readTime: '10 分钟阅读'
  },
  {
    id: '2',
    title: 'TypeScript 高级类型实战',
    summary: '探索 TypeScript 中的高级类型用法，提升类型安全...',
    content: `# TypeScript 高级类型实战

## 类型体操简介

TypeScript 的类型系统非常强大，通过组合使用各种类型操作符，我们可以构建出复杂的类型定义。

## 常用高级类型

### Partial<T>

将类型的所有属性变为可选：

\`\`\`typescript
interface User {
  name: string;
  age: number;
}

type PartialUser = Partial<User>;
// 等价于
// {
//   name?: string;
//   age?: number;
// }
\`\`\`

### Pick<T, K>

从类型中选择部分属性：

\`\`\`typescript
interface User {
  name: string;
  age: number;
  email: string;
}

type UserBasicInfo = Pick<User, 'name' | 'age'>;
// 等价于
// {
//   name: string;
//   age: number;
// }
\`\`\`

## 实战示例

### 构建响应类型

\`\`\`typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface User {
  id: number;
  name: string;
}

type UserResponse = ApiResponse<User>;
\`\`\`

### 类型守卫

\`\`\`typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    // 这里的 value 被收窄为 string 类型
    console.log(value.toUpperCase());
  }
}
\`\`\`
`,
    createdAt: '2024-03-19',
    category: 'frontend',
    tags: ['typescript', 'javascript'],
    readTime: '15 分钟阅读'
  },
  {
    id: '3',
    title: 'Docker 容器化实践',
    summary: '学习如何使用 Docker 容器化你的应用...',
    content: `# Docker 容器化实践

## Docker 基础概念

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中。

## Dockerfile 最佳实践

\`\`\`dockerfile
# 使用多阶段构建
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "80:80"
  db:
    image: postgres:14
    environment:
      POSTGRES_PASSWORD: example
\`\`\`

## 常用命令

\`\`\`bash
# 构建镜像
docker build -t myapp .

# 运行容器
docker run -d -p 80:80 myapp

# 查看日志
docker logs -f container_id
\`\`\`
`,
    createdAt: '2024-03-18',
    category: 'devops',
    tags: ['docker', 'devops', 'container'],
    readTime: '12 分钟阅读'
  }
]

export function useArticles() {
  const articles = ref<Article[]>(mockArticles)
  
  // 获取所有文章
  function getAllArticles() {
    return articles.value
  }
  
  // 根据ID获取文章
  function getArticleById(id: string) {
    return articles.value.find(article => article.id === id)
  }
  
  // 根据分类获取文章
  function getArticlesByCategory(category: string) {
    return articles.value.filter(article => article.category === category)
  }
  
  // 根据标签获取文章
  function getArticlesByTag(tag: string) {
    return articles.value.filter(article => article.tags.includes(tag))
  }

  return {
    articles,
    getAllArticles,
    getArticleById,
    getArticlesByCategory,
    getArticlesByTag
  }
} 