<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div
        v-if="uiStore.isAdminConsoleOpen"
        class="fixed z-[100] flex flex-col overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl transition-colors duration-500 rounded-2xl font-sans text-white"
        :style="{
          width: size.w + 'px',
          height: size.h + 'px',
          left: position.x + 'px',
          top: position.y + 'px',
          backgroundColor: mapStore.currentTheme?.sidebar.bg + 'F2',
          borderColor: mapStore.currentTheme?.sidebar.border
        }"
    >
      <header
          @mousedown="startDragging"
          class="h-11 flex items-center justify-between px-5 cursor-grab active:cursor-grabbing border-b select-none transition-colors shrink-0"
          :style="{ backgroundColor: mapStore.currentTheme?.sidebar.activeBg, borderColor: mapStore.currentTheme?.sidebar.border }"
      >
        <span class="flex items-center gap-3 pointer-events-none text-white font-sans">
          <span class="text-sm">🖥️</span>
          <span class="text-[10px] font-black uppercase tracking-widest leading-none" :style="{ color: mapStore.currentTheme?.sidebar.accent }">
            Admin Terminal "Traveler.OS v.1.0"
          </span>
        </span>

        <button @click="uiStore.toggleAdminConsole" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 transition-all active:scale-90 group border-none outline-none bg-transparent cursor-pointer text-white font-bold">
          <span class="text-xs opacity-40 group-hover:opacity-100">✕</span>
        </button>
      </header>

      <div class="flex-1 overflow-hidden flex">
        <aside class="w-64 border-r overflow-hidden flex flex-col items-center shrink-0" :style="{ borderColor: mapStore.currentTheme?.sidebar.border }">
          <div class="w-full px-5 py-4 border-b flex justify-center items-center text-center" :style="{ borderColor: mapStore.currentTheme?.sidebar.border }">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50" :style="{ color: mapStore.currentTheme?.sidebar.text }">
              {{ langStore.currentLang === 'ru' ? 'Панель управления' : 'Control Panel' }}
            </h3>
          </div>
          <nav class="w-full flex-1 overflow-y-auto custom-scrollbar py-3 px-3 flex flex-col gap-1">
            <button
                v-for="item in navItems" :key="item.id"
                @click="activeSection = item.id"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] border border-transparent text-left outline-none bg-transparent cursor-pointer text-white"
                :style="{
                  backgroundColor: activeSection === item.id ? mapStore.currentTheme?.sidebar.activeBg : 'transparent',
                  color: activeSection === item.id ? mapStore.currentTheme?.sidebar.accent : mapStore.currentTheme?.sidebar.text
                }"
            >
              <span class="text-base">{{ item.icon }}</span>
              <span class="text-[11px] font-black uppercase tracking-wider">{{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}</span>
            </button>
          </nav>
        </aside>

        <main class="flex-1 overflow-hidden relative flex flex-col bg-black/10">
          <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2">
            <EconomyTab v-if="activeSection === 'currency'" />
            <ThemesTab v-else-if="activeSection === 'theme'" />
            <div v-else class="w-full h-full flex items-center justify-center opacity-20 italic text-xs font-mono">
              Module [{{ activeSection }}] is currently encrypted...
            </div>
          </Transition>
        </main>

        <!-- Уголок ресайза -->
        <div @mousedown="startResizing" class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group pointer-events-auto">
          <svg viewBox="0 0 16 16" class="w-full h-full transition-all duration-300 overflow-visible">
            <path d="M16 0 L16 16 L0 16 Z" class="transition-all duration-300" :style="{fill: mapStore.currentTheme?.sidebar.accent, opacity: isResizing ? '0.4' : '0.1'}"/>
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import EconomyTab from './ui/EconomyTab.vue'
import ThemesTab from './ui/ThemesTab.vue'

const mapStore = useMapStore()
const uiStore = useUiStore()
const langStore = useLangStore()

const activeSection = ref('currency')
const position = ref({ x: 0, y: 0 })
const size = ref({ w: 900, h: 600 })

const navItems = [
  { id: 'currency', nameRu: 'Экономика', nameEn: 'Economics', icon: '💰' },
  { id: 'theme', nameRu: 'Управление темами', nameEn: 'Theme Access', icon: '🎨' },
  { id: 'general', nameRu: 'Общие', nameEn: 'General', icon: '⚙️' },
  { id: 'users', nameRu: 'Пользователи', nameEn: 'Users', icon: '👥' },
]

// Логика Drag & Resize
const isResizing = ref(false)
const startDragging = (e: MouseEvent) => {
  const offset = { x: e.clientX - position.value.x, y: e.clientY - position.value.y }
  const onMove = (ev: MouseEvent) => {
    position.value.x = ev.clientX - offset.x
    position.value.y = ev.clientY - offset.y
  }
  const onUp = () => {
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

const startResizing = (e: MouseEvent) => {
  e.stopPropagation()
  isResizing.value = true
  const startSize = { w: size.value.w, h: size.value.h }
  const startPos = { x: e.clientX, y: e.clientY }
  const onMove = (ev: MouseEvent) => {
    size.value.w = Math.max(750, startSize.w + (ev.clientX - startPos.x))
    size.value.h = Math.max(500, startSize.h + (ev.clientY - startPos.y))
  }
  const onUp = () => {
    isResizing.value = false
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }
  window.addEventListener('mousemove', onMove)
  window.addEventListener('mouseup', onUp)
}

onMounted(() => {
  position.value.x = (window.innerWidth - size.value.w) / 2
  position.value.y = (window.innerHeight - size.value.h) / 2
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.2); border-radius: 10px; }
</style>