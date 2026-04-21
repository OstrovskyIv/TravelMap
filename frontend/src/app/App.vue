<template>
  <div
      class="h-screen w-screen overflow-hidden font-sans relative transition-colors duration-1000 bg-[var(--bg-main)]"
      :style="themeVars"
  >
    <div class="absolute inset-0 z-10 w-full h-full">
      <RouterView />
    </div>

    <MenuToggle />
    <MainSidebar />
    <AdminConsole />
  </div>
</template>

<script setup lang="ts">
import { mapThemeToCssVars } from '@entities/map/lib/themeMapper'
import MenuToggle from '@/features/navigation/ui/MenuToggle.vue'

const mapStore = useMapStore()

const themeVars = computed(() => {
  if (!mapStore.currentTheme) return {}
  return mapThemeToCssVars(mapStore.currentTheme)
})
</script>