<template>
  <div class="h-screen w-screen bg-black overflow-hidden font-sans relative">

    <div class="absolute inset-0 z-10 w-full h-full">
      <RouterView />
    </div>

    <Transition
        enter-active-class="transition-all duration-500 delay-300 ease-out"
        enter-from-class="-translate-x-full opacity-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="-translate-x-full opacity-0"
    >
      <div v-if="!uiStore.isSidebarOpen" @click="uiStore.toggleSidebar" class="absolute left-0 top-0 h-full w-20 z-40 flex items-center justify-center pointer-events-none group">
        <button class="w-12 h-auto py-10 flex flex-col items-center justify-center gap-8 bg-[#18181b]/80 backdrop-blur-3xl border-y border-r border-white/10 rounded-r-[40px] pointer-events-auto hover:w-14 transition-all duration-500 shadow-2xl group border-none outline-none">

          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" class="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity">
            <g stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </g>
          </svg>

          <div class="flex flex-col items-center gap-2 select-none">
            <span v-for="char in (langStore.currentLang === 'ru' ? 'МЕНЮ' : 'MENU')" :key="char" class="text-[11px] font-black text-white/20 group-hover:text-white/80 transition-colors leading-none">
              {{ char }}
            </span>
          </div>

          <div class="w-1.5 h-1.5 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.4)] transition-all" :style="{ backgroundColor: mapStore.currentTheme?.colors.ui.accent }"></div>
        </button>
      </div>
    </Transition>

    <MainSidebar :theme="mapStore.currentTheme" />
    <AdminConsole />

  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { MainSidebar } from '@/shared/ui/MainSidebar'
import { AdminConsole } from '@/shared/ui/AdminConsole'
import { useMapStore } from '@/stores/mapStore'
import { useUiStore } from '@/stores/uiStore'
import { useLangStore } from '@/stores/langStore'

const mapStore = useMapStore()
const uiStore = useUiStore()
const langStore = useLangStore()
</script>