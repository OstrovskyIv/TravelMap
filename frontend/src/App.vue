<template>
  <div class="h-screen w-screen bg-black overflow-hidden font-sans relative">
    <div class="absolute inset-0 z-10 w-full h-full">
      <RouterView />
    </div>

    <div v-if="!uiStore.isSidebarOpen" @click="uiStore.toggleSidebar" class="absolute left-0 top-0 h-full w-3 z-40 cursor-pointer group transition-all duration-300 hover:w-6 flex items-center justify-center">
      <div class="h-20 w-1 rounded-full bg-white/10 group-hover:bg-blue-500/40 transition-all blur-[1px]"></div>
    </div>

    <MainSidebar :theme="mapStore.currentTheme" />

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