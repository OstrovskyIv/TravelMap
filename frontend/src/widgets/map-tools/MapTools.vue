<template>
  <div class="flex flex-col gap-4 items-end pointer-events-none">
    <!-- Кнопка Триггер -->
    <button
        @click="isOpen = !isOpen"
        class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl border backdrop-blur-xl outline-none cursor-pointer z-20 group bg-[var(--search-bg)] pointer-events-auto"
        :style="{ borderColor: isOpen ? 'var(--ui-accent)' : 'var(--ui-border)' }"
    >
      <div class="relative w-8 h-6 flex flex-col justify-between pointer-events-none">
        <div v-for="i in 2" :key="i" class="relative w-full h-[3px] bg-white/10 rounded-full">
          <div
              class="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full transition-all duration-300 border border-black/20"
              :class="(i === 1 ? isOpen : !isOpen) ? 'translate-x-5' : 'translate-x-0'"
              :style="{
                backgroundColor: (i === 1 ? isOpen : !isOpen) ? 'var(--ui-accent)' : '#ffffff',
                boxShadow: (i === 1 ? isOpen : !isOpen) ? '0 0 10px var(--ui-accent)' : 'none'
              }"
          ></div>
        </div>
      </div>
    </button>

    <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-[-20px] scale-95"
        leave-active-class="transition-all duration-400 ease-in"
        leave-to-class="opacity-0 translate-y-[-20px] scale-95"
    >
      <div v-if="isOpen" class="flex flex-col gap-4 items-end z-10 pointer-events-auto">
        <!-- Список инструментов -->
        <div v-for="tool in tools" :key="tool.id" class="flex items-center gap-3 justify-end group/item">
          <button
              @click="handleToolClick(tool.id)"
              class="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border backdrop-blur-xl outline-none cursor-pointer shadow-lg bg-[var(--search-bg)]"
              :style="{
                borderColor: (tool.id === 'labels' && mapStore.showLabels) ? 'var(--ui-accent)' : 'var(--ui-border)',
                color: (tool.id === 'labels' && mapStore.showLabels) ? 'var(--ui-accent)' : '#ffffff'
              }"
          >
            <span class="text-lg">{{ tool.icon }}</span>
          </button>
        </div>

        <!-- Контроллер Зума -->
        <div class="flex flex-col items-center gap-4 py-6 px-3 bg-[var(--sidebar-bg)]/80 backdrop-blur-3xl rounded-[32px] border border-white/5 shadow-2xl">
          <button @click="adjustZoom(1.5)" class="text-white hover:text-[var(--ui-accent)] border-none bg-transparent cursor-pointer font-black text-lg">+</button>

          <div class="relative h-32 w-8 flex items-center justify-center">
            <input
                type="range" min="1" max="20" step="0.1"
                :value="mapStore.zoomLevel"
                @input="onZoomInput"
                class="absolute w-32 cursor-pointer accent-[var(--ui-accent)]"
                style="transform: rotate(-90deg); background: transparent;"
            />
          </div>

          <button @click="adjustZoom(-1.5)" class="text-white hover:text-[var(--ui-accent)] border-none bg-transparent cursor-pointer font-black text-lg">-</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MapRenderer } from '@shared/lib/MapRenderer'

const mapStore = useMapStore()
const isOpen = ref(false)

type ToolId = 'labels' | 'magnifier' | 'draw'
const tools: { id: ToolId, icon: string }[] = [
  { id: 'labels', icon: '🏷️' },
  { id: 'magnifier', icon: '🔍' },
  { id: 'draw', icon: '✏️' }
]

const handleToolClick = (id: ToolId) => {
  if (id === 'labels') mapStore.showLabels = !mapStore.showLabels
}

const onZoomInput = (e: Event) => {
  const val = parseFloat((e.target as HTMLInputElement).value)
  mapStore.setZoom(val)
  MapRenderer.programmaticZoom(val)
}

const adjustZoom = (delta: number) => {
  const newVal = mapStore.zoomLevel + delta
  mapStore.setZoom(newVal)
  MapRenderer.programmaticZoom(mapStore.zoomLevel)
}
</script>