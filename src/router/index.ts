import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/article/:id',
      name: 'Article',
      component: () => import('../pages/Article.vue')
    },
    {
      path: '/categories',
      name: 'Categories',
      component: () => import('../pages/Categories.vue')
    },
    {
      path: '/categories/:id',
      name: 'CategoryDetail',
      component: () => import('../pages/CategoryDetail.vue')
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../pages/About.vue')
    }
  ]
})

export default router 