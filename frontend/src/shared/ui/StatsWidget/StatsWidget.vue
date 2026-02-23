<template>
  <div
      class="flex flex-col gap-2 p-8 backdrop-blur-3xl transition-all duration-500 rounded-[40px] border shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      :style="{
      backgroundColor: theme?.sidebar.bg + 'CC',
      borderColor: theme?.colors.ui.accent + '33'
    }"
  >
    <span class="text-[11px] font-black uppercase tracking-[0.4em]" :style="{ color: theme?.colors.ui.accent }">
      {{ langStore.currentLang === 'ru' ? 'Журнал' : 'Travel Log' }}
    </span>

    <div class="flex items-baseline gap-3">
      <span class="text-5xl font-black text-white leading-none tracking-tighter">
        {{ store.visited.length }}
      </span>
      <span class="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-none">
        {{ langStore.currentLang === 'ru' ? 'Регионы' : 'Regions' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{
  theme: MapTheme | undefined
}>()

const store = useMapStore()
const langStore = useLangStore()
</script>