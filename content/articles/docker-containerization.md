---
title: "Docker 容器化实践"
date: "2024-03-18"
category: "devops"
tags: ["Docker", "DevOps"]
readTime: "12 分钟阅读"
---

# Docker 容器化实践

Docker 已经成为现代应用部署的标准工具。本文将介绍 Docker 的基本概念和实际应用。

## Docker 基础

Docker 是一个开源的应用容器引擎，让开发者可以打包他们的应用以及依赖包到一个可移植的容器中。

```dockerfile
# 使用 Node.js 官方镜像作为基础
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["npm", "start"]
```

## Docker Compose

Docker Compose 用于定义和运行多容器 Docker 应用程序。

```yaml
version: '3'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - .:/app
    depends_on:
      - db
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: example
```

## 最佳实践

1. 使用多阶段构建
2. 最小化镜像大小
3. 使用 .dockerignore
4. 合理使用缓存

## 总结

Docker 为应用部署提供了标准化的解决方案，通过容器化可以确保应用在不同环境中一致运行。 