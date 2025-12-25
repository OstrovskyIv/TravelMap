import { createRouter, createWebHistory } from 'vue-router'
import { MapPage } from '../pages/MapPage'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapPage
    }
  ]
})

export default router