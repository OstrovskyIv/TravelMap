<template>
  <div class="flex h-screen w-screen bg-[#050505] text-white overflow-hidden font-sans">

    <MainSidebar :theme="mapStore.currentTheme" />

    <main class="flex-1 relative h-full overflow-hidden transition-all duration-500">

      <Transition
          enter-active-class="transition-all duration-300 delay-300"
          enter-from-class="opacity-0 -translate-x-10"
          leave-active-class="transition-all duration-200"
          leave-to-class="opacity-0 -translate-x-10"
      >
        <button v-if="!uiStore.isSidebarOpen" @click="uiStore.toggleSidebar" class="absolute top-10 left-6 z-40 w-12 h-12 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 transition-all shadow-2xl">
          <span class="text-xs opacity-50">▶</span>
        </button>
      </Transition>

      <RouterView />
    </main>

  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { MainSidebar } from '@/shared/ui/MainSidebar'
import { useMapStore } from '@/stores/mapStore'
import { useUiStore } from '@/stores/uiStore'

const mapStore = useMapStore()
const uiStore = useUiStore()
</script>