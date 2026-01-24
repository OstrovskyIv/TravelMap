<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 scale-95 translate-y-4"
  >
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
      <!-- ШАПКА ОКНА (DRAG ZONE) -->
      <header
          @mousedown="startDragging"
          class="h-11 flex items-center justify-between px-4 cursor-grab active:cursor-grabbing border-b select-none transition-colors shrink-0"
          :style="{ backgroundColor: store.currentTheme?.sidebar.activeBg, borderColor: store.currentTheme?.sidebar.border }"
      >
        <span class="flex items-center gap-3 pointer-events-none text-white">
          <span class="text-sm">🖥️</span>
          <span class="flex flex-col">
            <span class="text-[10px] font-black uppercase tracking-widest leading-none" :style="{ color: store.currentTheme?.sidebar.accent }">
              Terminal v.1.0.1
            </span>
            <span class="text-[8px] font-mono opacity-40 uppercase tracking-tighter" :style="{ color: store.currentTheme?.sidebar.text }">
              Root privileges active
            </span>
          </span>
        </span>
        <button
            @click="uiStore.toggleAdminConsole"
            class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 transition-all active:scale-90 group border-none outline-none bg-transparent cursor-pointer"
        >
          <span class="text-xs opacity-40 group-hover:opacity-100 group-hover:text-white" :style="{ color: store.currentTheme?.sidebar.text }">✕</span>
        </button>
      </header>

      <!-- ТЕЛО КОНСОЛИ -->
      <div class="flex flex-1 overflow-hidden">
        <aside class="w-64 h-full border-r flex flex-col bg-black/10 shrink-0" :style="{ borderColor: store.currentTheme?.sidebar.border }">
          <nav class="flex-1 overflow-y-auto p-3 flex flex-col gap-1 custom-scrollbar text-white">
            <button
                v-for="tab in tabs" :key="tab.id"
                @click="activeTabId = tab.id"
                class="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group text-left outline-none border-none bg-transparent cursor-pointer"
                :class="{ 'bg-white/5 shadow-inner': activeTabId === tab.id }"
                :style="activeTabId === tab.id ? { color: Array.isArray(store.currentTheme?.colors.map.visited) ? store.currentTheme?.colors.map.visited[0] : store.currentTheme?.colors.map.visited } : { color: store.currentTheme?.sidebar.text }"
            >
              <span class="text-lg transition-transform group-hover:scale-110">{{ tab.icon }}</span>
              <span class="text-[11px] font-bold uppercase tracking-wider">{{ langStore.currentLang === 'ru' ? tab.nameRu : tab.nameEn }}</span>
            </button>
          </nav>
        </aside>

        <main class="flex-1 h-full bg-black/5 relative overflow-hidden flex flex-col text-white">
          <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2">
            <!-- ЭКРАН ОЖИДАНИЯ -->
            <div v-if="!activeTabId" class="w-full h-full flex flex-col items-center justify-center gap-5">
              <div
                  class="w-10 h-10 border-2 border-white/5 rounded-full animate-spin"
                  :style="{ borderTopColor: Array.isArray(store.currentTheme?.colors.map.visited) ? store.currentTheme?.colors.map.visited[0] : store.currentTheme?.colors.map.visited }"
              ></div>
              <span class="flex flex-col items-center gap-1 opacity-40 text-center px-10">
                <span class="text-[10px] font-black uppercase tracking-[0.3em]" :style="{ color: store.currentTheme?.sidebar.text }">System Idle</span>
                <span class="text-[9px] font-mono italic" :style="{ color: store.currentTheme?.sidebar.text }">Select a module to proceed...</span>
              </span>
            </div>

            <!-- МОДУЛЬ: ОБЩЕЕ -->
            <div v-else-if="activeTabId === 'general'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar text-white">
              <h3 class="text-3xl font-black uppercase tracking-tighter italic text-white">General</h3>
              <span class="p-8 bg-white/5 border border-white/10 rounded-[32px] flex flex-col gap-6 shadow-xl">
                <span class="text-[9px] font-black uppercase tracking-widest opacity-30 text-white">System Localization</span>
                <LangSwitcher :theme="store.currentTheme" />
              </span>
            </div>

            <!-- МОДУЛЬ: ЭКОНОМИКА (НОВОЕ) -->
            <div v-else-if="activeTabId === 'economy'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar text-white font-sans">
              <h3 class="text-3xl font-black uppercase tracking-tighter italic">System Economy</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Начисление -->
                <span class="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col gap-6 shadow-2xl">
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-white">Fund Injection</span>
                  <div class="flex gap-2">
                    <button
                        v-for="amount in [500, 1000, 5000]" :key="amount"
                        @click="userStore.addBalance(amount)"
                        class="flex-1 py-4 rounded-2xl bg-[#fbbf24] hover:brightness-110 text-black font-black text-xs uppercase transition-all shadow-lg active:scale-95 border-none outline-none cursor-pointer"
                    >
                      +{{ amount }} ⭐
                    </button>
                  </div>
                </span>
                <!-- Баланс -->
                <span class="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col gap-2 justify-center shadow-2xl">
                  <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 text-white">Current Balance</span>
                  <span class="text-5xl font-black text-[#fbbf24] tracking-tighter">{{ userStore.balance }} ⭐</span>
                </span>
              </div>
            </div>
          </Transition>
        </main>
      </div>

      <!-- STATUS BAR -->
      <footer class="h-6 flex items-center px-4 justify-between transition-colors border-t shrink-0 relative" :style="{ backgroundColor: store.currentTheme?.sidebar.bg, borderColor: store.currentTheme?.sidebar.border }">
        <span class="text-[9px] font-mono opacity-20 uppercase tracking-tighter" :style="{ color: store.currentTheme?.sidebar.text }">Status: OK</span>

        <span
            @mousedown="startResizing"
            class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5 group"
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" class="opacity-20 group-hover:opacity-100 transition-opacity" :style="{ stroke: store.currentTheme?.sidebar.accent }">
            <line x1="1" y1="7" x2="7" y2="1" stroke-width="1.5" stroke-linecap="round" />
            <line x1="4" y1="7" x2="7" y2="4" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </span>
      </footer>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLangStore } from '@/stores/langStore'
import { useMapStore } from '@/stores/mapStore'
import { useUiStore } from '@/stores/uiStore'
import { useUserStore } from '@/stores/userStore' // Добавили стор юзера
import { LangSwitcher } from '@/shared/ui/LangSwitcher'

const store = useMapStore()
const langStore = useLangStore()
const uiStore = useUiStore()
const userStore = useUserStore() // Константа для стора

const activeTabId = ref<string | null>(null)
const position = ref({ x: 0, y: 0 })
const size = ref({ w: 900, h: 600 })

// ИСПРАВЛЕНО: const вместо let для объекта смещения
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

let isResizing = false
const initialMousePos = { x: 0, y: 0 }
const initialSize = { w: 0, h: 0 }

const startResizing = (e: MouseEvent) => {
  e.stopPropagation()
  isResizing = true
  initialMousePos.x = e.clientX
  initialMousePos.y = e.clientY
  initialSize.w = size.value.w
  initialSize.h = size.value.h

  window.addEventListener('mousemove', handleResizing)
  window.addEventListener('mouseup', stopResizing)
}

const handleResizing = (e: MouseEvent) => {
  if (!isResizing) return
  const deltaX = e.clientX - initialMousePos.x
  const deltaY = e.clientY - initialMousePos.y
  size.value.w = Math.max(600, initialSize.w + deltaX)
  size.value.h = Math.max(400, initialSize.h + deltaY)
}

const stopResizing = () => {
  isResizing = false
  window.removeEventListener('mousemove', handleResizing)
  window.removeEventListener('mouseup', stopResizing)
}

const tabs = [
  { id: 'general', icon: '🛠️', nameRu: 'Общее', nameEn: 'General' },
  { id: 'economy', icon: '💰', nameRu: 'Экономика', nameEn: 'Economy' }, // Новая вкладка
  { id: 'themes', icon: '🎨', nameRu: 'Темы', nameEn: 'Themes' },
  { id: 'users', icon: '👤', nameRu: 'Доступ', nameEn: 'Access' }
]

onMounted(() => {
  position.value.x = (window.innerWidth - size.value.w) / 2
  position.value.y = (window.innerHeight - size.value.h) / 2
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.2); border-radius: 10px; }
</style>