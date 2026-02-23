<template>
  <div class="flex flex-col gap-4 items-end">
    <!-- Основная кнопка (Шестеренка) -->
    <button
        @click="isOpen = !isOpen"
        class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl border backdrop-blur-xl outline-none cursor-pointer z-20 group"
        :style="{
        backgroundColor: theme?.mapTools.bg,
        borderColor: isOpen ? theme?.mapTools.accent : theme?.mapTools.border,
        color: isOpen ? theme?.mapTools.accent : '#ffffff'
      }"
    >
      <span
             class="text-2xl transition-transform duration-700 ease-in-out"
          :class="{ 'rotate-180 opacity-50': isOpen }"
      >
        ⚙️
      </span>
    </button>

    <!-- Меню инструментов -->
    <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-[-20px] scale-95"
        leave-active-class="transition-all duration-400 ease-in"
        leave-to-class="opacity-0 translate-y-[-20px] scale-95"
    >
      <div
          v-if="isOpen"
          class="flex flex-col gap-3 z-10"
      >
        <div
            v-for="tool in tools"
            :key="tool.id"
            class="flex items-center gap-3 justify-end group/item"
            @mouseenter="hoveredTool = tool.id"
            @mouseleave="hoveredTool = null"
        >
          <!-- ПОДСКАЗКА СЛЕВА -->
          <Transition
              enter-active-class="transition-all duration-300 ease-out"
              enter-from-class="opacity-0 translate-x-4"
              leave-active-class="transition-all duration-200 ease-in"
              leave-to-class="opacity-0 translate-x-4"
          >
            <span
                v-if="hoveredTool === tool.id"
                class="px-4 py-2 rounded-xl border backdrop-blur-3xl text-[10px] font-black uppercase tracking-widest text-white whitespace-nowrap shadow-xl"
                :style="{
                backgroundColor: theme?.mapTools.bg,
                borderColor: theme?.mapTools.border
              }"
            >
              {{ langStore.currentLang === 'ru' ? tool.nameRu : tool.nameEn }}
            </span>
          </Transition>

          <!-- Мини-кнопка -->
          <button
              @click="handleToolClick(tool.id)"
              class="w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 border backdrop-blur-xl outline-none cursor-pointer"
              :style="{
              backgroundColor: (tool.id === 'labels' && mapStore.showLabels) ? theme?.mapTools.activeBg : theme?.mapTools.bg,
              borderColor: (tool.id === 'labels' && mapStore.showLabels) ? theme?.mapTools.accent : theme?.mapTools.border,
              color: (tool.id === 'labels' && mapStore.showLabels) ? theme?.mapTools.accent : '#ffffff'
            }"
          >
            <span class="text-lg">{{ tool.icon }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLangStore } from '@/stores/langStore'
import { useMapStore } from '@/stores/mapStore'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{
  theme: MapTheme | undefined
}>()

const langStore = useLangStore()
const mapStore = useMapStore()
const isOpen = ref(false)
const hoveredTool = ref<string | null>(null)

const tools = [
  { id: 'labels', icon: '🏷️', nameRu: 'Названия', nameEn: 'Labels' },
  { id: 'magnifier', icon: '🔍', nameRu: 'Лупа', nameEn: 'Magnifier' },
  { id: 'draw', icon: '✏️', nameRu: 'Рисовать', nameEn: 'Draw' },
]

const handleToolClick = (id: string) => {
  if (id === 'labels') {
    mapStore.showLabels = !mapStore.showLabels
  }
}
</script>