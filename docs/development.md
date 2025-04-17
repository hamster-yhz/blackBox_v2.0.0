# 开发指南

## 代码规范

1. 使用 TypeScript 进行开发
2. 遵循 Vue 3 组合式 API 风格
3. 使用 ESLint 和 Prettier 进行代码格式化
4. 组件命名使用 PascalCase
5. 文件命名使用 kebab-case

## 组件开发规范

1. 组件应该放在 `src/components` 目录下
2. 每个组件应该有对应的类型定义
3. 使用 `defineComponent` 定义组件
4. 使用 `setup` 函数或 `<script setup>` 语法
5. 使用 `ref` 和 `reactive` 管理状态

## 路由规范

1. 使用文件系统路由（基于 vite-plugin-pages）
2. 页面组件放在 `src/views` 目录下
3. 路由参数使用 TypeScript 类型定义

## 状态管理

1. 使用 Pinia 进行状态管理
2. Store 应该放在 `src/stores` 目录下
3. 使用 TypeScript 定义 Store 的类型

## 样式规范

1. 使用 Tailwind CSS 进行样式开发
2. 使用 DaisyUI 组件库
3. 自定义样式放在 `src/assets/styles` 目录下

## 工具函数

1. 工具函数放在 `src/utils` 目录下
2. 使用 TypeScript 定义函数类型
3. 编写单元测试

## 类型定义

1. 类型定义放在 `src/types` 目录下
2. 使用 TypeScript 类型系统
3. 避免使用 any 类型 