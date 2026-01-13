import { createRouter, createWebHistory } from 'vue-router'
import { MapPage } from '@/pages/MapPage'
import { AdminPage } from '@/pages/AdminPage'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapPage
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage
    }
  ]
})

export default router