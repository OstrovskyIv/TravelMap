<template>
  <Transition enter-active-class="transition-all duration-500 delay-300 ease-out" enter-from-class="-translate-x-full opacity-0" leave-active-class="transition-all duration-300" leave-to-class="-translate-x-full opacity-0">
    <div v-if="!uiStore.isSidebarOpen" @click="uiStore.toggleSidebar"
         :class="['fixed z-40 flex items-center justify-center pointer-events-none group', isMobile ? 'left-6 top-6' : 'left-0 top-0 h-full w-20']">
      <button :class="['flex flex-col items-center justify-center bg-[var(--sidebar-bg)]/80 backdrop-blur-3xl border border-white/10 pointer-events-auto transition-all duration-500 shadow-2xl group border-none outline-none cursor-pointer', isMobile ? 'w-14 h-14 rounded-2xl' : 'w-12 h-auto py-10 rounded-r-[40px] gap-8 hover:w-14']">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" class="w-6 h-6 opacity-60 group-hover:opacity-100"><g stroke-width="2.5" stroke-linecap="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></g></svg>
        <span v-if="!isMobile" class="flex flex-col items-center gap-2 select-none">
          <span v-for="char in langStore.t.navigation.menu" :key="char" class="text-[11px] font-black text-white/20 group-hover:text-white/80 leading-none">{{ char }}</span>
        </span>
        <span class="w-1.5 h-1.5 rounded-full shadow-[0_0_15px_var(--ui-accent)] bg-[var(--ui-accent)]" :class="isMobile ? 'mt-1' : ''"></span>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useScreen } from '@shared/lib/useScreen'
const { isMobile } = useScreen()
const uiStore = useUiStore()
const langStore = useLangStore()
</script>