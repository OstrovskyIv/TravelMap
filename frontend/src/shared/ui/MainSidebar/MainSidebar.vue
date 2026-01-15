<template>
  <Transition
      enter-active-class="transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
      leave-active-class="transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
  >
    <aside v-if="ui.isSidebarOpen" class="absolute left-0 top-0 h-full w-80 flex flex-col gap-10 p-8 z-50 shadow-[20px_0_60px_rgba(0,0,0,0.5)] border-r backdrop-blur-3xl" :style="{ backgroundColor: theme?.sidebar.bg, borderColor: theme?.sidebar.border }">
      <header class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-black tracking-tighter uppercase leading-none" :style="{ color: theme?.sidebar.accent }">
            Traveler
          </h1>
          <button @click="ui.toggleSidebar" class="opacity-20 hover:opacity-100 transition-all hover:scale-110 active:scale-90 p-1">
            <span class="text-xs" :style="{ color: theme?.sidebar.text }">◀</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-[1px] w-4" :style="{ backgroundColor: theme?.searchDock.accent }"></div>
          <span class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-40" :style="{ color: theme?.sidebar.text }">v4.0.2 Stable</span>
        </div>
      </header>

      <nav class="flex flex-col gap-2">
        <RouterLink v-for="item in menuItems" :key="item.id" :to="item.path" class="group flex items-center gap-5 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:translate-x-1 active:scale-95" :style="$route.name === item.id ? { backgroundColor: theme?.sidebar.activeBg } : {}">
          <span class="text-xl filter drop-shadow-md group-hover:scale-110 transition-transform">{{ item.icon }}</span>
          <span class="text-[13px] font-bold tracking-tight uppercase transition-colors" :style="$route.name === item.id ? { color: theme?.sidebar.accent } : { color: theme?.sidebar.text }">
            {{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}
          </span>
        </RouterLink>
      </nav>

      <section class="mt-auto flex flex-col gap-4">
        <div class="flex flex-col gap-3 p-6 rounded-[32px] border transition-all shadow-inner overflow-hidden" :style="{ backgroundColor: theme?.sidebar.activeBg, borderColor: theme?.sidebar.border }">
          <header class="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
            <span :style="{ color: theme?.sidebar.text }">{{ langStore.currentLang === 'ru' ? 'Прогресс' : 'Discovery' }}</span>
            <span :style="{ color: theme?.sidebar.accent }">{{ Math.round((store.visited.length / ALL_COUNTRIES.length) * 100) }}%</span>
          </header>
          <div class="flex items-baseline gap-2 font-black tracking-tighter">
            <span class="text-4xl" :style="{ color: theme?.sidebar.accent }">{{ store.visited.length }}</span>
            <span class="text-[11px] opacity-30" :style="{ color: theme?.sidebar.text }">/ {{ ALL_COUNTRIES.length }}</span>
          </div>
          <div class="w-full h-1 bg-black/10 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000 ease-out" :style="{ width: `${(store.visited.length / ALL_COUNTRIES.length) * 100}%`, backgroundColor: theme?.searchDock.accent }"></div>
          </div>
        </div>

        <div class="flex items-center gap-4 p-2 group cursor-pointer">
          <div class="w-11 h-11 rounded-2xl shadow-lg flex items-center justify-center text-white font-bold text-xs transition-transform group-hover:scale-105" :style="{ backgroundColor: theme?.searchDock.accent }">
            {{ userStore.userName.charAt(0) }}
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-bold tracking-tight" :style="{ color: theme?.sidebar.accent }">{{ userStore.userName }}</span>
            <span class="text-[9px] uppercase tracking-widest opacity-30 font-mono" :style="{ color: theme?.sidebar.text }">Navigator</span>
          </div>
        </div>
      </section>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore'
import { ALL_COUNTRIES } from '@/countries'
import { RouterLink, useRoute } from 'vue-router'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{ theme: MapTheme | undefined }>()

const store = useMapStore()
const langStore = useLangStore()
const userStore = useUserStore()
const ui = useUiStore()
const $route = useRoute()

const menuItems = [
  { id: 'home', path: '/', icon: '🌍', nameRu: 'Атлас', nameEn: 'World Atlas' },
  { id: 'admin', path: '/admin', icon: '⚙️', nameRu: 'Админ', nameEn: 'Control' }
]
</script>