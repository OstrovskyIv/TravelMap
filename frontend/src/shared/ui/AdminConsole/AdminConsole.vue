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

      <div class="flex-1 overflow-hidden relative flex">

        <!-- Левый блок - навигация -->
        <aside class="w-64 border-r overflow-hidden flex flex-col items-center shrink-0" :style="{ borderColor: store.currentTheme?.sidebar.border }">
          <div class="w-full px-5 py-4 border-b flex justify-center items-center text-center" :style="{ borderColor: store.currentTheme?.sidebar.border }">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50" :style="{ color: store.currentTheme?.sidebar.text }">
              {{ langStore.currentLang === 'ru' ? 'Панель управления' : 'Control Panel' }}
            </h3>
          </div>
          <div class="w-full flex-1 overflow-y-auto custom-scrollbar py-3">
            <nav class="px-3 flex flex-col gap-1">
              <button
                  v-for="item in navItems"
                  :key="item.id"
                  @click="activeSection = item.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] border border-transparent text-left outline-none bg-transparent cursor-pointer"
                  :style="{
                    backgroundColor: activeSection === item.id ? store.currentTheme?.sidebar.activeBg : 'transparent',
                    borderColor: activeSection === item.id ? store.currentTheme?.sidebar.accent + '40' : 'transparent',
                    color: activeSection === item.id ? store.currentTheme?.sidebar.accent : store.currentTheme?.sidebar.text
                  }"
              >
                <span class="text-base">{{ item.icon }}</span>
                <span class="text-[11px] font-black uppercase tracking-wider">{{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Правый блок - Основа -->
        <main class="flex-1 overflow-hidden relative flex flex-col bg-black/10">
          <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2">

            <!-- Экран загрузки -->
            <div v-if="!activeSection" class="w-full h-full flex flex-col items-center justify-center gap-6">
              <div class="w-10 h-10 border-2 border-white/5 border-t-white/60 rounded-full animate-spin" :style="{ borderTopColor: Array.isArray(store.currentTheme?.colors.map.visited) ? store.currentTheme?.colors.map.visited[0] : store.currentTheme?.colors.map.visited }"></div>
              <div class="flex flex-col items-center gap-1 opacity-40 text-center px-10">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] text-white">System Standby</span>
                <span class="text-[9px] font-mono italic text-white">Please select a module from the sidebar</span>
              </div>
            </div>

            <!-- Общие настройки -->
            <div v-else-if="activeSection === 'general'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              <h3 class="text-2xl font-black uppercase tracking-tighter italic text-white">General Settings</h3>
              <div class="flex flex-col gap-4 p-8 bg-white/5 border border-white/5 rounded-[32px] shadow-xl text-white">
                <span class="text-[9px] font-black uppercase tracking-widest opacity-30">System Language</span>
                <LangSwitcher :theme="store.currentTheme" />
              </div>
            </div>

            <!-- Валюта -->
            <div v-else-if="activeSection === 'currency'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar text-white">
              <h3 class="text-2xl font-black uppercase tracking-tighter italic">Economic Control</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="p-8 bg-white/5 border border-white/5 rounded-[40px] flex flex-col gap-6 shadow-xl">
                  <span class="text-[9px] font-black uppercase tracking-widest opacity-30 text-white">Fund Injection</span>
                  <div class="flex gap-2">
                    <button
                        v-for="val in [100, 500, 1000]" :key="val"
                        @click="userStore.addBalance(val)"
                        class="flex-1 py-3 rounded-xl bg-[#fbbf24] text-black font-black text-[10px] uppercase hover:brightness-110 transition-all active:scale-95 border-none outline-none cursor-pointer"
                    >
                      +{{ val }} ⭐
                    </button>
                  </div>
                </div>
                <div class="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col gap-2 justify-center text-center">
                  <span class="text-[9px] font-black uppercase tracking-widest opacity-30 text-white">Account Balance</span>
                  <span class="text-4xl font-black text-[#fbbf24] tracking-tighter leading-none">{{ userStore.balance }} ⭐</span>
                </div>
              </div>
            </div>

            <!-- Темы -->
            <div v-else-if="activeSection === 'theme'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar text-white font-sans">
              <h3 class="text-2xl font-black uppercase tracking-tighter italic">Theme Engine</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                <button
                    v-for="t in themesList" :key="t.id"
                    @click="store.setTheme(t.id)"
                    class="p-5 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/10 transition-all group outline-none border-none"
                    :style="store.currentTheme?.id === t.id ? { borderColor: '#fbbf24', backgroundColor: 'rgba(251, 191, 36, 0.05)' } : {}"
                >
                  <span class="flex items-center gap-4">
                    <span class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner">{{ t.id === 'wooden' ? '🪵' : '✨' }}</span>
                    <span class="text-[11px] font-black uppercase tracking-widest">{{ t.name }}</span>
                  </span>
                  <span v-if="store.currentTheme?.id === t.id" class="text-[8px] font-bold text-[#fbbf24] uppercase tracking-widest animate-pulse">Running</span>
                </button>
              </div>
            </div>

          </Transition>
        </main>

        <!-- Уголок -->
        <div @mousedown="startResizing" class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group pointer-events-auto">
          <svg viewBox="0 0 16 16" class="w-full h-full transition-all duration-300 overflow-visible">
            <path d="M16 0 L16 16 L0 16 Z" class="transition-all duration-300" :style="{fill: store.currentTheme?.sidebar.accent, opacity: isResizing ? '0.4' : '0.1'}"/>
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
import { useLangStore } from '@/stores/langStore'
import { useUserStore } from '@/stores/userStore'
import { MAP_THEMES } from '@/shared/map-themes'
import { LangSwitcher } from '@/shared/ui/LangSwitcher'

const store = useMapStore()
const uiStore = useUiStore()
const langStore = useLangStore()
const userStore = useUserStore()
const themesList = Object.values(MAP_THEMES)

const navItems = [
  { id: 'general', nameRu: 'Общие настройки', nameEn: 'General Settings', icon: '⚙️' },
  { id: 'currency', nameRu: 'Экономика', nameEn: 'Economics', icon: '💰' },
  { id: 'theme', nameRu: 'Магазин тем', nameEn: 'Theme Engine', icon: '🎨' },
  { id: 'users', nameRu: 'Пользователи', nameEn: 'User Access', icon: '👥' },
  { id: 'backup', nameRu: 'Резерв', nameEn: 'Backup', icon: '💾' },
]

const activeSection = ref<string | null>(null)
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
  size.value.w = Math.max(600, initialSize.w + deltaX)
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
.custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.3); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(155, 155, 155, 0.5); }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
</style>