<template>
  <div class="flex flex-col items-end pointer-events-none gap-3">
    <Transition enter-active-class="transition-all duration-500 ease-out" enter-from-class="opacity-0 translate-x-10" leave-active-class="transition-all duration-300 ease-in" leave-to-class="opacity-0 translate-x-10">
      <div v-if="mapStore.isRouteMode && mapStore.routePoints.length > 0" class="pointer-events-auto px-6 py-4 bg-black/90 backdrop-blur-2xl border border-[var(--ui-accent)]/30 rounded-[28px] flex flex-col items-end shadow-2xl min-w-[160px]">
        <span class="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--ui-accent)] opacity-50 leading-none mb-1">Travel Distance</span>
        <div class="flex items-baseline gap-2">
          <span class="text-3xl font-black text-white italic tracking-tighter">{{ mapStore.totalDistance }}</span>
          <span class="text-[10px] font-bold text-white/40 uppercase">KM</span>
        </div>
        <div class="text-[8px] font-mono text-white/20 uppercase mt-2 italic">Nodes: {{ mapStore.routePoints.length }}</div>
      </div>
    </Transition>

    <button @click="isOpen = !isOpen" :class="['flex items-center justify-center transition-all duration-300 shadow-2xl border backdrop-blur-xl outline-none cursor-pointer z-50 bg-[var(--search-bg)] pointer-events-auto', isMobile ? 'w-11 h-11 rounded-xl' : 'w-14 h-14 rounded-2xl']" :style="{ borderColor: isOpen ? 'var(--ui-accent)' : 'var(--ui-border)' }">
      <div :class="['relative flex flex-col justify-between pointer-events-none', isMobile ? 'w-5 h-3.5' : 'w-6 h-5']">
        <div v-for="i in 2" :key="i" class="relative w-full h-[2px] bg-white/20 rounded-full">
          <div class="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300 border border-black/20" :class="(i === 1 ? isOpen : !isOpen) ? (isMobile ? 'translate-x-2.5' : 'translate-x-3.5') : 'translate-x-0'" :style="{ backgroundColor: (i === 1 ? isOpen : !isOpen) ? 'var(--ui-accent)' : '#ffffff', boxShadow: (i === 1 ? isOpen : !isOpen) ? '0 0 10px var(--ui-accent)' : 'none' }"></div>
        </div>
      </div>
    </button>

    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2 scale-95" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 -translate-y-2 scale-95">
      <div v-if="isOpen" class="flex flex-col gap-3 items-end pointer-events-auto">
        <div v-for="tool in tools" :key="tool.id">
          <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0 scale-50 -translate-y-2" leave-active-class="opacity-0 scale-50 -translate-y-2">
            <div v-if="shouldShowTool(tool.id)" class="flex items-center justify-center">
              <BaseTooltip :text="getTooltipText(tool.id)" position="left">
                <button @click="handleToolClick(tool.id)" :class="['flex items-center justify-center transition-all hover:scale-110 active:scale-95 border backdrop-blur-xl outline-none cursor-pointer shadow-lg bg-[var(--search-bg)]', isMobile ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl']" :style="{ borderColor: isToolActive(tool.id) ? 'var(--ui-accent)' : 'var(--ui-border)', color: isToolActive(tool.id) ? 'var(--ui-accent)' : '#ffffff' }">
                  <span :class="isMobile ? 'text-base' : 'text-xl'" class="leading-none flex items-center justify-center">{{ tool.icon }}</span>
                </button>
              </BaseTooltip>
            </div>
          </Transition>
        </div>

        <div :class="['flex flex-col items-center bg-[var(--sidebar-bg)]/90 backdrop-blur-3xl border border-white/5 shadow-2xl', isMobile ? 'w-10 py-4 rounded-xl gap-3' : 'w-12 py-6 rounded-2xl gap-4']">
          <BaseTooltip :text="langStore.t.tooltips.zoomIn || ''" position="left">
            <button @click="adjustZoom(1.5)" class="text-white hover:text-[var(--ui-accent)] border-none bg-transparent cursor-pointer font-black leading-none" :class="isMobile ? 'text-xs' : 'text-base'">+</button>
          </BaseTooltip>
          <div :class="['relative flex items-center justify-center', isMobile ? 'h-24 w-1.5' : 'h-32 w-2']">
            <div class="absolute inset-0 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
              <div class="w-full bg-[var(--ui-accent)] transition-all duration-200" :style="{ height: `${((mapStore.zoomLevel - 1) / 14) * 100}%` }"></div>
            </div>
            <input type="range" min="1" max="15" step="0.1" :value="mapStore.zoomLevel" @input="onZoomInput" class="absolute cursor-pointer opacity-0" :style="{ width: isMobile ? '96px' : '128px', height: '40px', transform: 'rotate(-90deg)', margin: '0', padding: '0' }" />
          </div>
          <BaseTooltip :text="langStore.t.tooltips.zoomOut || ''" position="left">
            <button @click="adjustZoom(-1.5)" class="text-white hover:text-[var(--ui-accent)] border-none bg-transparent cursor-pointer font-black leading-none" :class="isMobile ? 'text-xs' : 'text-base'">-</button>
          </BaseTooltip>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import BaseTooltip from '@shared/ui/base-tooltip/BaseTooltip.vue'
import { MapRenderer } from '@shared/lib/map-engine/MapRenderer'
import { useScreen } from '@shared/lib/useScreen'
const { isMobile } = useScreen(); const mapStore = useMapStore(); const langStore = useLangStore(); const isOpen = ref(false)
type ToolId = 'labels' | 'cursor' | 'route' | 'undo' | 'clear'
const tools: { id: ToolId, icon: string }[] = [{ id: 'labels', icon: '🏷️' }, { id: 'cursor', icon: '🎯' }, { id: 'route', icon: '✈️' }, { id: 'undo', icon: '↩️' }, { id: 'clear', icon: '🗑️' }]
const shouldShowTool = (id: ToolId) => {
  if (id === 'cursor') return mapStore.showLabels
  if (id === 'undo' || id === 'clear') return mapStore.routePoints.length > 0
  return true
}
const isToolActive = (id: ToolId) => {
  if (id === 'labels') return mapStore.showLabels
  if (id === 'cursor') return mapStore.showCursorLabel
  if (id === 'route') return mapStore.isRouteMode
  return false
}
const getTooltipText = (id: ToolId): string => {
  if (id === 'labels') return mapStore.showLabels ? (langStore.t.tooltips.hideLabels || '') : (langStore.t.tooltips.showLabels || '')
  return (langStore.t.tooltips[id as keyof typeof langStore.t.tooltips] as string) || ''
}
const handleToolClick = (id: ToolId) => {
  if (id === 'labels') mapStore.showLabels = !mapStore.showLabels
  if (id === 'cursor') mapStore.showCursorLabel = !mapStore.showCursorLabel
  if (id === 'route') mapStore.isRouteMode = !mapStore.isRouteMode
  if (id === 'undo') {
    mapStore.removeLastPoint()
    MapRenderer.drawRoute(mapStore.routePoints, mapStore.mapFeatures, mapStore.currentTheme!)
  }
  if (id === 'clear') {
    mapStore.clearRoute()
    MapRenderer.drawRoute([], [], mapStore.currentTheme!)
  }
}
const onZoomInput = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value)
  mapStore.setZoom(val); MapRenderer.programmaticZoom(val)
}
const adjustZoom = (delta: number) => {
  const newVal = mapStore.zoomLevel + delta
  mapStore.setZoom(newVal); MapRenderer.programmaticZoom(mapStore.zoomLevel)
}
</script>

<style scoped>
input[type=range] { -webkit-appearance: none; appearance: none; }
input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 40px; width: 40px; }
</style>