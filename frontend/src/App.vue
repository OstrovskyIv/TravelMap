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
      <div v-if="!uiStore.isSidebarOpen" @click="uiStore.toggleSidebar" class="absolute left-0 top-0 h-full w-14 sm:w-16 md:w-20 lg:w-24 z-40 flex items-center justify-center pointer-events-none group">
        <button class="w-12 h-auto py-8 flex flex-col items-center justify-center gap-6 bg-white/5 backdrop-blur-2xl border-y border-r border-white/10 rounded-r-xl sm:rounded-r-[32px] pointer-events-auto hover:w-14 hover:bg-white/10 transition-all duration-500 shadow-[10px_0_30px_rgba(0,0,0,0.2)] sm:shadow-[20px_0_40px_rgba(0,0,0,0.3)] group border-none outline-none bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 opacity-40 group-hover:opacity-100 transition-opacity">
            <g stroke-width="2.5" stroke-linecap="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </g>
          </svg>
          <span class="flex flex-col items-center gap-1 lg:gap-2 select-none">
            <span v-for="char in (langStore.currentLang === 'ru' ? 'МЕНЮ' : 'MENU')" :key="char" class="text-[8px] sm:text-[10px] md:text-[11px] lg:text-[12px] xl:text-[13px] font-black text-white/20 group-hover:text-white/60 transition-colors leading-none">
              {{ char }}
            </span>
          </span>
          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500/40 group-hover:bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"></span>
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