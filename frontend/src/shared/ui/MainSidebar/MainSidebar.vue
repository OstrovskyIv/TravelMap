<template>
  <Transition
      enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
      leave-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
  >
    <aside v-if="ui.isSidebarOpen" class="absolute left-0 top-0 bottom-0 w-80 flex flex-col gap-10 p-10 z-50 shadow-[20px_0_60px_rgba(0,0,0,0.6)] border-r backdrop-blur-3xl transition-all duration-500 rounded-r-[48px]" :style="{ backgroundColor: '#18181bE6', borderColor: 'rgba(251, 191, 36, 0.2)' }">
      <header class="flex flex-col gap-4">
        <div class="flex items-center justify-between gap-4">
          <div class="flex flex-col gap-1">
            <h1 class="text-3xl font-black tracking-tighter uppercase leading-none text-white italic">Traveler</h1>
            <span class="text-[10px] font-bold uppercase tracking-tight text-white/40 leading-none">
              {{ langStore.currentLang === 'ru' ? 'Карта путешественника' : "Traveler's Atlas" }}
            </span>
            <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#fbbf24]/10 border border-[#fbbf24]/20 w-fit shrink-0 overflow-hidden">
              <div class="w-1.5 h-1.5 rounded-full bg-[#fbbf24] animate-pulse shrink-0"></div>
              <span class="text-[8px] font-black uppercase tracking-widest text-[#fbbf24] whitespace-nowrap">
                {{ langStore.currentLang === 'ru' ? 'Версия: СНГ' : 'Edition: CIS' }}
              </span>
            </div>
          </div>
          <button @click="ui.toggleSidebar" class="shrink-0 group w-11 h-11 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all outline-none border-none bg-transparent">
            <span class="text-xs transition-transform group-hover:-translate-x-0.5 text-white/40">◀</span>
          </button>
        </div>
      </header>

      <nav class="flex flex-col gap-3 font-sans text-white">
        <RouterLink v-for="item in menuItems" :key="item.id" :to="item.path" class="group flex items-center gap-5 p-5 rounded-[24px] transition-all duration-300 hover:translate-x-1 active:scale-95 border border-transparent shadow-sm" :style="$route.name === item.id ? { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' } : {}">
          <span class="text-2xl filter drop-shadow-md group-hover:scale-110 transition-transform">{{ item.icon }}</span>
          <span class="text-[13px] font-black tracking-widest uppercase transition-colors" :style="{ color: $route.name === item.id ? '#fbbf24' : '#a1a1aa' }">
            {{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}
          </span>
        </RouterLink>

        <button v-if="userStore.isAdmin" @click="ui.toggleAdminConsole" class="group flex items-center gap-5 p-5 rounded-[24px] transition-all duration-300 hover:translate-x-1 border border-dashed border-white/10 bg-transparent outline-none text-left" :class="{ 'bg-[#fbbf24]/10 border-[#fbbf24]/30': ui.isAdminConsoleOpen }">
          <span class="text-2xl opacity-40 group-hover:opacity-100 transition-opacity">⚙️</span>
          <span class="text-[13px] font-black uppercase tracking-widest transition-colors" :style="{ color: ui.isAdminConsoleOpen ? '#fbbf24' : '#a1a1aa' }">
             {{ langStore.currentLang === 'ru' ? 'Консоль' : 'Admin Console' }}
          </span>
        </button>
      </nav>

      <div class="flex-1"></div>
      <section class="flex flex-col gap-6">
        <div class="flex flex-col gap-4 p-8 bg-[#18181b]/80 border border-[#fbbf24]/20 rounded-[36px] shadow-2xl transition-all">
          <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-[#fbbf24]">
            <span>Discovery</span>
            <span>{{ Math.round((store.visited.length / ALL_COUNTRIES.length) * 100) }}%</span>
          </div>
          <div class="flex items-baseline gap-2 font-black tracking-tighter leading-none text-white">
            <span class="text-5xl">{{ store.visited.length }}</span>
            <span class="text-[12px] opacity-20">/ {{ ALL_COUNTRIES.length }}</span>
          </div>
        </div>

        <div class="flex items-center gap-5 p-3 group cursor-pointer border border-transparent hover:bg-white/5 rounded-[28px] transition-all">
          <div class="w-14 h-14 rounded-[20px] shadow-xl flex items-center justify-center text-[#18181b] font-black text-lg transition-transform group-hover:scale-105 bg-[#fbbf24]">
            {{ userStore.userName.charAt(0) }}
          </div>
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-black tracking-tight text-white">{{ userStore.userName }}</span>
            <span class="text-[9px] uppercase tracking-widest opacity-30 font-mono text-white leading-none">Master Navigator</span>
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
  { id: 'home', path: '/', icon: '🌍', nameRu: 'Атлас', nameEn: 'Atlas' },
  { id: 'shop', path: '/shop', icon: '💎', nameRu: 'Магазин', nameEn: 'Shop' },
  { id: 'stats', path: '/stats', icon: '📊', nameRu: 'Инфо', nameEn: 'Stats' },
  { id: 'settings', path: '/settings', icon: '🔮', nameRu: 'Опции', nameEn: 'Settings' }
]
</script>