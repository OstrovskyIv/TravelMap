import { createRouter, createWebHistory } from 'vue-router'
import { MapPage } from '@/pages/MapPage'
import { AdminPage } from '@/pages/AdminPage'
import { ShopPage } from '@/pages/ShopPage'
import { SettingsPage } from '@/pages/SettingsPage'

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