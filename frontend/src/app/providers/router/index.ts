import { createRouter, createWebHistory } from 'vue-router'
// Используем алиас @pages
import { MapPage } from '@pages/MapPage'
import { ShopPage } from '@pages/ShopPage'
import { SettingsPage } from '@pages/SettingsPage'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MapPage
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopPage
    },
    { path: '/settings',
      name: 'settings',
      component: SettingsPage
    }
  ]
})

export default router