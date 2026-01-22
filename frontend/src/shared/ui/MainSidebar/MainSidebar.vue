<template>
  <Transition
      enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
      leave-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
  >
    <!--
      ABSOLUTE: Теперь меню парит над картой.
      BACKDROP-BLUR: Размывает карту под меню для эффекта стекла.
    -->
    <aside
        v-if="ui.isSidebarOpen"
        class="absolute left-0 top-0 h-full w-80 flex flex-col gap-10 p-10 z-50 shadow-[25px_0_60px_rgba(0,0,0,0.5)] border-r backdrop-blur-3xl transition-all duration-500"
        :style="{ backgroundColor: theme?.sidebar.bg + 'CC', borderColor: theme?.sidebar.border }"
    >
      <!-- ХЕДЕР: Название "Страны СНГ" -->
      <header class="flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-2xl font-black tracking-tighter uppercase leading-none" :style="{ color: theme?.sidebar.accent }">
              {{ langStore.currentLang === 'ru' ? 'Страны СНГ' : 'CIS Nations' }}
            </h1>
            <span class="text-[10px] font-mono uppercase tracking-[0.4em] opacity-30 mt-1" :style="{ color: theme?.sidebar.text }">
              v4.0.2 Stable
            </span>
          </div>
          <!-- Кнопка сворачивания -->
          <button @click="ui.toggleSidebar" class="group w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all">
            <span class="text-xs transition-transform group-hover:-translate-x-0.5" :style="{ color: theme?.sidebar.text }">◀</span>
          </button>
        </div>
      </header>

      <!-- НАВИГАЦИЯ: Ссылки на страницы -->
      <nav class="flex flex-col gap-3 font-sans">
        <RouterLink
            v-for="item in menuItems" :key="item.id" :to="item.path"
            class="group flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 hover:translate-x-1 active:scale-95 border border-transparent shadow-sm"
            :style="$route.name === item.id ? { backgroundColor: theme?.sidebar.activeBg, borderColor: theme?.sidebar.border } : {}"
        >
          <span class="text-xl filter drop-shadow-md group-hover:scale-110 transition-transform">{{ item.icon }}</span>
          <span class="text-[12px] font-black tracking-widest uppercase transition-colors" :style="$route.name === item.id ? { color: theme?.sidebar.accent } : { color: theme?.sidebar.text }">
            {{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}
          </span>
        </RouterLink>

        <!-- АДМИН-КОНСОЛЬ (Теперь это кнопка вызова модального окна) -->
        <button
            v-if="userStore.isAdmin"
            @click="ui.toggleAdminConsole"
            class="group flex items-center gap-5 p-4 rounded-2xl transition-all duration-300 hover:translate-x-1 border border-dashed border-white/10 mt-4 bg-transparent outline-none text-left"
            :class="{ 'bg-white/5 shadow-inner': ui.isAdminConsoleOpen }"
        >
          <span class="text-xl opacity-40 group-hover:opacity-100 transition-opacity">⚙️</span>
          <span class="text-[11px] font-black uppercase tracking-widest transition-colors" :style="{ color: ui.isAdminConsoleOpen ? theme?.sidebar.accent : theme?.sidebar.text }">
             {{ langStore.currentLang === 'ru' ? 'Консоль' : 'Admin Console' }}
          </span>
        </button>
      </nav>

      <!-- ПОДВАЛ: Прогресс и Профиль -->
      <section class="mt-auto flex flex-col gap-6">
        <div class="flex flex-col gap-4 p-6 rounded-[32px] border transition-all shadow-inner bg-black/10" :style="{ borderColor: theme?.sidebar.border }">
          <div class="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] opacity-40">
            <span :style="{ color: theme?.sidebar.text }">Mission Progress</span>
            <span :style="{ color: theme?.sidebar.accent }">{{ Math.round((store.visited.length / ALL_COUNTRIES.length) * 100) }}%</span>
          </div>
          <div class="flex items-baseline gap-2 font-black tracking-tighter leading-none text-white">
            <span class="text-4xl" :style="{ color: theme?.sidebar.accent }">{{ store.visited.length }}</span>
            <span class="text-[11px] opacity-20" :style="{ color: theme?.sidebar.text }">/ {{ ALL_COUNTRIES.length }}</span>
          </div>
        </div>

        <div class="flex items-center gap-4 p-2 group cursor-pointer border border-transparent hover:border-white/5 rounded-2xl transition-all">
          <div class="w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-white font-black text-sm transition-transform group-hover:scale-105" :style="{ backgroundColor: theme?.searchDock.accent }">
            {{ userStore.userName.charAt(0) }}
          </div>
          <div class="flex flex-col">
            <span class="text-xs font-black tracking-tight" :style="{ color: theme?.sidebar.accent }">{{ userStore.userName }}</span>
            <span class="text-[9px] uppercase tracking-widest opacity-20 font-mono" :style="{ color: theme?.sidebar.text }">Master Navigator</span>
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
  { id: 'shop', path: '/shop', icon: '💎', nameRu: 'Магазин', nameEn: 'Style Shop' },
  { id: 'stats', path: '/stats', icon: '📊', nameRu: 'Инфо', nameEn: 'Analytics' },
  { id: 'settings', path: '/settings', icon: '🔮', nameRu: 'Опции', nameEn: 'Settings' }
]
</script>