<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <!-- Корпус окна -->
    <div
        v-if="uiStore.isAdminConsoleOpen"
        class="fixed z-[100] flex flex-col overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl transition-colors duration-500 rounded-2xl"
        :style="{
        width: size.w + 'px',
        height: size.h + 'px',
        left: position.x + 'px',
        top: position.y + 'px',
        backgroundColor: store.currentTheme?.sidebar.bg + 'F2',
        borderColor: store.currentTheme?.sidebar.border
      }"
    >
      <!-- Верхняя панель в терминале -->
      <header
          @mousedown="startDragging"
          class="h-11 flex items-center justify-between px-5 cursor-grab active:cursor-grabbing border-b select-none transition-colors shrink-0"
          :style="{ backgroundColor: store.currentTheme?.sidebar.activeBg, borderColor: store.currentTheme?.sidebar.border }"
      >
        <span class="flex items-center gap-3 pointer-events-none text-white font-sans">
          <span class="text-sm">🖥️</span>
          <span class="flex flex-col">
            <span class="text-[10px] font-black uppercase tracking-widest leading-none" :style="{ color: store.currentTheme?.sidebar.accent }">
              Admin Terminal "Test.v.1.0"
            </span>
          </span>
        </span>

        <button @click="uiStore.toggleAdminConsole" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 transition-all active:scale-90 group border-none outline-none bg-transparent cursor-pointer">
          <span class="text-xs opacity-40 group-hover:opacity-100 group-hover:text-white" :style="{ color: store.currentTheme?.sidebar.text }">✕</span>
        </button>
      </header>

      <!-- Основной блок -->
      <div class="flex-1 overflow-hidden relative flex">
        <div class="w-64,border-r">
          <!-- Левый блок -->
        </div>

        <div class="flex-1 overflow-hidden">
          <!-- Правый блок -->
        </div>

        <!-- Уголок -->
        <div @mousedown="startResizing" class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group pointer-events-auto">
          <svg viewBox="0 0 16 16" class="w-full h-full transition-all duration-300 overflow-visible">
            <path d="M16 0 L16 16 L0 16 Z" class="transition-all duration-300" :style="{fill: store.currentTheme?.sidebar.accent,opacity: isResizing ? '0.4' : '0.1'}"/>
            <path d="M0 16 L16 0" class="transition-opacity duration-300 opacity-20 group-hover:opacity-60" :style="{ stroke: store.currentTheme?.sidebar.accent }" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useUiStore } from '@/stores/uiStore'

const store = useMapStore()
const uiStore = useUiStore()

const position = ref({ x: 0, y: 0 })
const size = ref({ w: 900, h: 600 })

const dragOffset = { x: 0, y: 0 }
let isDragging = false

const startDragging = (e: MouseEvent) => {
  isDragging = true
  dragOffset.x = e.clientX - position.value.x
  dragOffset.y = e.clientY - position.value.y
  window.addEventListener('mousemove', handleDragging)
  window.addEventListener('mouseup', stopDragging)
}

const handleDragging = (e: MouseEvent) => {
  if (!isDragging) return
  position.value.x = e.clientX - dragOffset.x
  position.value.y = e.clientY - dragOffset.y
}

const stopDragging = () => {
  isDragging = false
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
}

const isResizing = ref(false)
const initialMousePos = { x: 0, y: 0 }
const initialSize = { w: 0, h: 0 }

const startResizing = (e: MouseEvent) => {
  e.stopPropagation()
  isResizing.value = true
  initialMousePos.x = e.clientX
  initialMousePos.y = e.clientY
  initialSize.w = size.value.w
  initialSize.h = size.value.h

  window.addEventListener('mousemove', handleResizing)
  window.addEventListener('mouseup', stopResizing)
}

const handleResizing = (e: MouseEvent) => {
  if (!isResizing.value) return
  const deltaX = e.clientX - initialMousePos.x
  const deltaY = e.clientY - initialMousePos.y

  size.value.w = Math.max(500, initialSize.w + deltaX)
  size.value.h = Math.max(400, initialSize.h + deltaY)
}

const stopResizing = () => {
  isResizing.value = false
  window.removeEventListener('mousemove', handleResizing)
  window.removeEventListener('mouseup', stopResizing)
}

onMounted(() => {
  position.value.x = (window.innerWidth - size.value.w) / 2
  position.value.y = (window.innerHeight - size.value.h) / 2
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.2); border-radius: 10px; }
</style>