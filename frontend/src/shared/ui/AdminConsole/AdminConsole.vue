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
        class="fixed z-[100] flex flex-col overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl transition-colors duration-500 rounded-2xl font-sans text-white"
        :style="{
        width: size.w + 'px',
        height: size.h + 'px',
        left: position.x + 'px',
        top: position.y + 'px',
        backgroundColor: store.currentTheme?.sidebar.bg + 'F2',
        borderColor: store.currentTheme?.sidebar.border
      }"
    >
      <!-- Верхняя панель -->
      <header
          @mousedown="startDragging"
          class="h-11 flex items-center justify-between px-5 cursor-grab active:cursor-grabbing border-b select-none transition-colors shrink-0"
          :style="{ backgroundColor: store.currentTheme?.sidebar.activeBg, borderColor: store.currentTheme?.sidebar.border }"
      >
        <span class="flex items-center gap-3 pointer-events-none text-white font-sans">
          <span class="text-sm">🖥️</span>
          <span class="flex flex-col text-white">
            <span class="text-[10px] font-black uppercase tracking-widest leading-none" :style="{ color: store.currentTheme?.sidebar.accent }">
              Admin Terminal "Test.v.1.0"
            </span>
          </span>
        </span>

        <button @click="uiStore.toggleAdminConsole" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 transition-all active:scale-90 group border-none outline-none bg-transparent cursor-pointer text-white font-bold">
          <span class="text-xs opacity-40 group-hover:opacity-100">✕</span>
        </button>
      </header>

      <div class="flex-1 overflow-hidden relative flex">
        <!-- Лево: Навигация -->
        <aside class="w-64 border-r overflow-hidden flex flex-col items-center shrink-0" :style="{ borderColor: store.currentTheme?.sidebar.border }">
          <div class="w-full px-5 py-4 border-b flex justify-center items-center text-center" :style="{ borderColor: store.currentTheme?.sidebar.border }">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-white" :style="{ color: store.currentTheme?.sidebar.text }">
              {{ langStore.currentLang === 'ru' ? 'Панель управления' : 'Control Panel' }}
            </h3>
          </div>
          <div class="w-full flex-1 overflow-y-auto custom-scrollbar py-3 px-3">
            <nav class="flex flex-col gap-1">
              <button
                  v-for="item in navItems" :key="item.id"
                  @click="activeSection = item.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] border border-transparent text-left outline-none bg-transparent cursor-pointer text-white"
                  :style="{
                  backgroundColor: activeSection === item.id ? store.currentTheme?.sidebar.activeBg : 'transparent',
                  color: activeSection === item.id ? store.currentTheme?.sidebar.accent : store.currentTheme?.sidebar.text
                }"
              >
                <span class="text-base text-white">{{ item.icon }}</span>
                <span class="text-[11px] font-black uppercase tracking-wider text-white">{{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Правый блок: Контент -->
        <main class="flex-1 overflow-hidden relative flex flex-col bg-black/10">
          <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2">

            <!-- Экран загрузки -->
            <div v-if="!activeSection" class="w-full h-full flex flex-col items-center justify-center gap-6">
              <div class="w-10 h-10 border-2 border-white/5 border-t-white/60 rounded-full animate-spin" :style="{ borderTopColor: store.currentTheme?.colors.map.visited[0] }"></div>
              <div class="flex flex-col items-center gap-1 opacity-40 text-center px-10 text-white font-sans">
                <span class="text-[10px] font-black uppercase tracking-[0.3em]">System Standby</span>
                <span class="text-[9px] font-mono italic text-white text-center">Please select a module from the sidebar</span>
              </div>
            </div>

            <!-- Экономика -->
            <div v-else-if="activeSection === 'currency'" class="w-full h-full p-8 lg:p-12 flex flex-col gap-10 overflow-y-auto custom-scrollbar text-white">
              <div class="w-full p-10 bg-[#fbbf24]/5 border border-[#fbbf24]/20 rounded-[48px] flex flex-col items-center justify-center gap-6 shadow-2xl shrink-0">
                <div class="flex flex-col items-center gap-1 text-center">
                  <span class="text-[11px] font-black uppercase tracking-[0.6em] text-[#fbbf24] opacity-80 leading-none">System Assets</span>
                  <span class="text-[9px] font-mono opacity-20 uppercase tracking-widest mt-2 text-white leading-none">Verified Ledger Record</span>
                </div>
                <div class="flex items-center gap-6 leading-none">
                  <span class="text-7xl font-black tracking-tighter leading-none text-white">{{ userStore.balance }}</span>
                  <span class="text-4xl animate-pulse">⭐</span>
                </div>
                <button @click="userStore.balance = 0" class="px-8 py-2.5 rounded-full bg-red-500/10 border border-red-500/40 text-red-500 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest outline-none border-none bg-transparent cursor-pointer">
                  Reset to zero
                </button>
              </div>

              <div class="flex flex-col gap-6 w-full">
                <div class="p-8 bg-white/5 border border-white/10 rounded-[36px] flex flex-col gap-6 shadow-xl">
                  <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 text-white leading-none">Quick Adjustment</span>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button @click="userStore.addBalance(100)" class="py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-black text-xs uppercase hover:bg-green-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">+100</button>
                    <button @click="userStore.addBalance(500)" class="py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-black text-xs uppercase hover:bg-green-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">+500</button>
                    <button @click="userStore.addBalance(-100)" class="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase hover:bg-red-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">-100</button>
                    <button @click="userStore.addBalance(-500)" class="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase hover:bg-red-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">-500</button>
                  </div>
                </div>

                <div class="p-8 bg-white/5 border border-white/10 rounded-[36px] flex flex-col gap-5 shadow-xl">
                  <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 text-white font-sans leading-none">Force Set Assets</span>
                  <div class="flex flex-col gap-3">
                    <input v-model="customBalance" type="number" min="0" class="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-[#fbbf24] transition-all text-white placeholder:opacity-30" placeholder="Enter amount..."/>
                    <button @click="setExactBalance" class="w-full py-4 rounded-2xl bg-[#fbbf24] text-black font-black text-xs uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg border-none outline-none cursor-pointer">Apply Changes</button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Общие настройки -->
            <div v-else-if="activeSection === 'general'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              <h3 class="text-2xl font-black uppercase tracking-tighter italic text-white">General</h3>
              <div class="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col gap-6 text-white shadow-xl">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">System Language</span>
                <!-- ИСПРАВЛЕНО: возвращен LangSwitcher -->
                <LangSwitcher :theme="store.currentTheme" />
              </div>
            </div>

            <!-- Темы -->
            <div v-else-if="activeSection === 'theme'" class="w-full h-full p-8 lg:p-12 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              <h3 class="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Theme Access Management</h3>
              <div class="flex flex-col gap-4">
                <div v-for="t in Object.values(store.themes)" :key="t.id" class="p-6 bg-white/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all group overflow-hidden">
                  <div class="flex items-center gap-6 min-w-0 flex-1">
                    <span class="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-3xl shadow-inner shrink-0 text-white">{{ t.id === 'wooden' ? '🪵' : '✨' }}</span>
                    <div class="flex flex-col gap-1 min-w-0">
                      <span class="text-[15px] font-black uppercase tracking-tight text-white whitespace-nowrap overflow-hidden text-ellipsis">{{ t.name }}</span>
                      <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-md w-fit" :class="userStore.purchasedThemes.includes(t.id) ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'">
                        {{ userStore.purchasedThemes.includes(t.id) ? 'Owned' : 'Locked' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <!-- ИСПРАВЛЕНО: убран bg-transparent для исключения конфликта -->
                    <button v-if="userStore.purchasedThemes.includes(t.id) && t.id !== 'classic'" @click="userStore.lockTheme(t.id)" class="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase whitespace-nowrap border-none outline-none cursor-pointer">Lock</button>
                    <button v-if="!userStore.purchasedThemes.includes(t.id)" @click="userStore.unlockTheme(t.id)" class="px-4 py-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all text-[9px] font-black uppercase whitespace-nowrap border-none outline-none cursor-pointer">Grant</button>
                    <button @click="store.setTheme(t.id)" class="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-[9px] font-black uppercase outline-none border-none cursor-pointer">Equip</button>
                  </div>
                </div>
              </div>
            </div>

          </Transition>
        </main>

        <!-- Уголок ресайза -->
        <div @mousedown="startResizing" class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group pointer-events-auto text-white">
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useUiStore } from '@/stores/uiStore'
import { useLangStore } from '@/stores/langStore'
import { useUserStore } from '@/stores/userStore'
import { LangSwitcher } from '@/shared/ui/LangSwitcher'

const store = useMapStore()
const uiStore = useUiStore()
const langStore = useLangStore()
const userStore = useUserStore()

// ИСПРАВЛЕНО: убран неиспользуемый themesList и computed

const customBalance = ref<number | null>(null)
const setExactBalance = () => {
  if (customBalance.value !== null) {
    userStore.balance = customBalance.value < 0 ? 0 : customBalance.value
    customBalance.value = null
  }
}

const navItems = [
  { id: 'general', nameRu: 'Общие настройки', nameEn: 'General Settings', icon: '⚙️' },
  { id: 'currency', nameRu: 'Экономика', nameEn: 'Economics', icon: '💰' },
  { id: 'theme', nameRu: 'Управление темами', nameEn: 'Theme Access', icon: '🎨' },
  { id: 'users', nameRu: 'Пользователи', nameEn: 'Users', icon: '👥' },
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
  size.value.w = Math.max(650, initialSize.w + deltaX)
  size.value.h = Math.max(450, initialSize.h + deltaY)
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

onUnmounted(() => {
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('mousemove', handleResizing)
  window.removeEventListener('mouseup', stopResizing)
})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.2); border-radius: 10px; }
</style>