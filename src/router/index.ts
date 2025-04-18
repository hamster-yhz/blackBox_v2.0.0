import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('../pages/Home.vue'),
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../components/Login.vue'),
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('../pages/Admin.vue'),
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