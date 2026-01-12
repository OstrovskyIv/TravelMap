<template>
  <Transition
      enter-active-class="transition-all duration-500 ease-in-out"
      leave-active-class="transition-all duration-500 ease-in-out"
      enter-from-class="-translate-x-full opacity-0"
      leave-to-class="-translate-x-full opacity-0"
  >
    <aside
        v-if="ui.isSidebarOpen"
        class="fixed lg:relative w-80 h-full border-r flex flex-col gap-8 p-8 transition-all duration-500 shadow-2xl z-40"
        :style="{ backgroundColor: theme?.sidebar.bg, borderColor: theme?.sidebar.border }"
    >
      <!-- Кнопка закрытия (внутри сайдбара) -->
      <button
          @click="ui.toggleSidebar"
          class="absolute -right-12 top-10 w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/20 transition-all lg:hidden"
      >
        ✕
      </button>

      <!-- Хедр -->
      <header class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-black tracking-tighter uppercase leading-none" :style="{ color: theme?.sidebar.accent }">
            Traveler
          </h1>
          <button @click="ui.toggleSidebar" class="hidden lg:block opacity-20 hover:opacity-100 transition-opacity">
            <span :style="{ color: theme?.sidebar.text }">◀</span>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <div class="h-[1px] w-4" :style="{ backgroundColor: theme?.searchDock.accent }"></div>
          <span class="text-[9px] font-mono uppercase tracking-[0.3em] opacity-40" :style="{ color: theme?.sidebar.text }">v4.0.2</span>
        </div>
      </header>

      <!-- Навигация -->
      <nav class="flex flex-col gap-2">
        <div
            v-for="item in menuItems" :key="item.id"
            class="group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 active:scale-95"
            :style="activeItem === item.id ? { backgroundColor: theme?.sidebar.activeBg } : {}"
        >
          <span class="text-xl group-hover:scale-110 transition-transform">{{ item.icon }}</span>
          <span class="text-sm font-bold transition-colors" :style="activeItem === item.id ? { color: theme?.sidebar.accent } : { color: theme?.sidebar.text }">
            {{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}
          </span>
        </div>
      </nav>

      <!-- Прогресс -->
      <section class="mt-auto flex flex-col gap-4">
        <div class="flex flex-col gap-2 p-5 rounded-[28px] border transition-all" :style="{ backgroundColor: theme?.sidebar.activeBg, borderColor: theme?.sidebar.border }">
          <span class="text-[9px] font-black uppercase tracking-widest opacity-40" :style="{ color: theme?.sidebar.text }">
            {{ langStore.currentLang === 'ru' ? 'Твой прогресс' : 'Discovery' }}
          </span>
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black" :style="{ color: theme?.sidebar.accent }">{{ store.visited.length }}</span>
            <span class="text-[10px] font-bold opacity-30" :style="{ color: theme?.sidebar.text }">/ {{ ALL_COUNTRIES.length }}</span>
          </div>
          <div class="w-full h-1 bg-black/10 rounded-full overflow-hidden">
            <div class="h-full transition-all duration-1000" :style="{ width: `${(store.visited.length / ALL_COUNTRIES.length) * 100}%`, backgroundColor: theme?.searchDock.accent }"></div>
          </div>
        </div>
      </section>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { useUiStore } from '@/stores/uiStore' // Импортируем новый стор
import { ALL_COUNTRIES } from '@/countries'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{ theme: MapTheme | undefined }>()

const store = useMapStore()
const langStore = useLangStore()
const ui = useUiStore()
const activeItem = ref('map')

const menuItems = [
  { id: 'map', icon: '🗺️', nameRu: 'Карта', nameEn: 'World Map' },
  { id: 'stats', icon: '📊', nameRu: 'Статистика', nameEn: 'Analytics' },
  { id: 'settings', icon: '⚙️', nameRu: 'Настройки', nameEn: 'Settings' }
]
</script>