<template>
  <div class="flex flex-col items-end pointer-events-none gap-3">
    <!-- Кнопка Триггер -->
    <button
        @click="isOpen = !isOpen"
        :class="[
          'flex items-center justify-center transition-all duration-300 shadow-2xl border backdrop-blur-xl outline-none cursor-pointer z-50 bg-[var(--search-bg)] pointer-events-auto',
          isMobile ? 'w-11 h-11 rounded-xl' : 'w-14 h-14 rounded-2xl'
        ]"
        :style="{ borderColor: isOpen ? 'var(--ui-accent)' : 'var(--ui-border)' }"
    >
      <div :class="['relative flex flex-col justify-between pointer-events-none', isMobile ? 'w-5 h-3.5' : 'w-6 h-5']">
        <div v-for="i in 2" :key="i" class="relative w-full h-[2px] bg-white/20 rounded-full">
          <div
              class="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full transition-all duration-300 border border-black/20"
              :class="(i === 1 ? isOpen : !isOpen) ? (isMobile ? 'translate-x-2.5' : 'translate-x-3.5') : 'translate-x-0'"
              :style="{
                backgroundColor: (i === 1 ? isOpen : !isOpen) ? 'var(--ui-accent)' : '#ffffff',
                boxShadow: (i === 1 ? isOpen : !isOpen) ? '0 0 10px var(--ui-accent)' : 'none'
              }"
          ></div>
        </div>
      </div>
    </button>

    <!-- Меню инструментов -->
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2 scale-95"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div v-if="isOpen" class="flex flex-col gap-3 items-end pointer-events-auto">
        <!-- Кнопки инструментов -->
        <div v-for="tool in tools" :key="tool.id" class="flex items-center justify-center">
          <button
              @click="handleToolClick(tool.id)"
              :class="[
                'flex items-center justify-center transition-all hover:scale-110 active:scale-95 border backdrop-blur-xl outline-none cursor-pointer shadow-lg bg-[var(--search-bg)]',
                isMobile ? 'w-10 h-10 rounded-xl' : 'w-12 h-12 rounded-2xl'
              ]"
              :style="{
                borderColor: (tool.id === 'labels' && mapStore.showLabels) ? 'var(--ui-accent)' : 'var(--ui-border)',
                color: (tool.id === 'labels' && mapStore.showLabels) ? 'var(--ui-accent)' : '#ffffff'
              }"
          >
            <span :class="isMobile ? 'text-base' : 'text-xl'" class="leading-none flex items-center justify-center">
              {{ tool.icon }}
            </span>
          </button>
        </div>

        <!-- Слайдер Зума -->
        <div :class="[
          'flex flex-col items-center bg-[var(--sidebar-bg)]/90 backdrop-blur-3xl border border-white/5 shadow-2xl',
          isMobile ? 'w-10 py-4 rounded-xl gap-3' : 'w-12 py-6 rounded-2xl gap-4'
        ]">
          <button @click="adjustZoom(1.5)" class="text-white hover:text-[var(--ui-accent)] border-none bg-transparent cursor-pointer font-black leading-none" :class="isMobile ? 'text-xs' : 'text-base'">+</button>

          <!-- Контейнер для вертикального инпута -->
          <div :class="['relative flex items-center justify-center', isMobile ? 'h-24 w-1.5' : 'h-32 w-2']">
            <!-- Визуальная дорожка -->
            <div class="absolute inset-0 bg-white/10 rounded-full overflow-hidden flex flex-col justify-end">
              <div
                  class="w-full bg-[var(--ui-accent)] transition-all duration-200"
                  :style="{ height: `${((mapStore.zoomLevel - 1) / 14) * 100}%` }"
              ></div>
            </div>

            <!-- Реальный инпут (прозрачный и повернутый) -->
            <input
                type="range" min="1" max="15" step="0.1"
                :value="mapStore.zoomLevel"
                @input="onZoomInput"
                class="absolute cursor-pointer opacity-0"
                :style="{
                width: isMobile ? '96px' : '128px',
                height: '40px',
                transform: 'rotate(-90deg)',
                margin: '0',
                padding: '0'
              }"
            />
          </div>

          <button @click="adjustZoom(-1.5)" class="text-white hover:text-[var(--ui-accent)] border-none bg-transparent cursor-pointer font-black leading-none" :class="isMobile ? 'text-xs' : 'text-base'">-</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { MapRenderer } from '@shared/lib/MapRenderer'
import { useScreen } from '@shared/lib/useScreen'

const { isMobile } = useScreen()
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

<style scoped>
/* Убираем любые системные отступы у инпута */
input[type=range] {
  -webkit-appearance: none;
  appearance: none;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 40px;
  width: 40px;
}
</style>