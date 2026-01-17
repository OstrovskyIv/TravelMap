<template>
  <div class="fixed inset-0 z-[100] flex flex-col font-sans transition-colors duration-1000 border border-white/5 shadow-2xl overflow-hidden" :style="{ backgroundColor: store.currentTheme?.background || '#0c0c0e' }">
    <header class="h-9 border-b flex items-center justify-between px-3 select-none transition-colors duration-500" :style="{ backgroundColor: store.currentTheme?.sidebar.bg, borderColor: store.currentTheme?.sidebar.border }">
      <div class="flex items-center gap-2">
        <span class="text-sm">🖥️</span>
        <span class="text-[11px] font-medium tracking-tight opacity-60 transition-colors" :style="{ color: store.currentTheme?.sidebar.accent }">
          Computer Management (Local) \ System Tools \ Traveler Admin
        </span>
      </div>
      <div class="flex h-full items-center">
        <button @click="router.push('/')" class="h-full px-4 hover:bg-red-500 transition-colors group outline-none border-none bg-transparent">
          <span class="text-xs group-hover:text-white opacity-40 transition-opacity" :style="{ color: store.currentTheme?.sidebar.accent }">✕</span>
        </button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="w-72 h-full border-r flex flex-col overflow-hidden transition-colors duration-500" :style="{ backgroundColor: store.currentTheme?.sidebar.bg, borderColor: store.currentTheme?.sidebar.border }">
        <header class="p-4 border-b bg-white/[0.02]" :style="{ borderColor: store.currentTheme?.sidebar.border }">
          <span class="text-[10px] font-bold uppercase tracking-widest" :style="{ color: Array.isArray(store.currentTheme?.colors.visited) ? store.currentTheme?.colors.visited[0] : store.currentTheme?.colors.visited }">
            Navigator
          </span>
        </header>

        <nav class="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5 custom-scrollbar">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTabId = tab.id" class="w-full flex items-center gap-3 p-2.5 rounded transition-all text-left outline-none border-l-2 border-transparent bg-transparent" :class="{ '!bg-white/5 shadow-inner !border-current': activeTabId === tab.id }" :style="activeTabId === tab.id ? { color: Array.isArray(store.currentTheme?.colors.visited) ? store.currentTheme?.colors.visited[0] : store.currentTheme?.colors.visited } : { color: store.currentTheme?.sidebar.text }">
            <span class="text-base">{{ tab.icon }}</span>
            <span class="text-[12px] font-medium tracking-tight">
              {{ langStore.currentLang === 'ru' ? tab.nameRu : tab.nameEn }}
            </span>
          </button>
        </nav>
      </aside>

      <main class="flex-1 h-full relative overflow-hidden flex flex-col bg-black/5 backdrop-blur-sm">
        <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-1"
            leave-active-class="transition-all duration-200 ease-in"
            leave-to-class="opacity-0 -translate-y-1"
        >
          <div v-if="!activeTabId" class="w-full h-full flex flex-col items-center justify-center gap-4">
            <div class="w-10 h-10 border-2 border-white/5 rounded-full animate-spin" :style="{ borderTopColor: Array.isArray(store.currentTheme?.colors.visited) ? store.currentTheme?.colors.visited[0] : store.currentTheme?.colors.visited }"
            ></div>
            <span class="flex flex-col items-center gap-1 text-center px-6">
              <span class="text-xs font-bold tracking-wide uppercase opacity-50" :style="{ color: store.currentTheme?.sidebar.accent }">System Management Console</span>
              <span class="text-[11px] font-mono italic opacity-30" :style="{ color: store.currentTheme?.sidebar.accent }">Please select an object in the left pane to view its properties.</span>
            </span>
          </div>

          <div v-else-if="activeTabId === 'general'" class="w-full h-full flex flex-col overflow-hidden">
            <header class="p-6 border-b bg-white/[0.01]" :style="{ borderColor: store.currentTheme?.sidebar.border }">
              <h3 class="text-xl font-bold tracking-tight" :style="{ color: store.currentTheme?.sidebar.accent }">General Properties</h3>
            </header>
            <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
              <span class="p-6 border rounded-lg flex flex-col gap-4 max-w-xl shadow-sm transition-all" :style="{ backgroundColor: store.currentTheme?.sidebar.bg, borderColor: store.currentTheme?.sidebar.border }">
                <span class="text-[10px] font-bold uppercase tracking-widest opacity-40" :style="{ color: store.currentTheme?.sidebar.text }">Interface Language Selection</span>
                <LangSwitcher :theme="store.currentTheme" />
                <span class="text-[10px] font-mono opacity-20" :style="{ color: store.currentTheme?.sidebar.accent }">Current Build: 1.0.1 (Stable Release)</span>
              </span>
            </div>
          </div>

          <div v-else-if="activeTabId === 'themes'" class="w-full h-full flex flex-col overflow-hidden">
            <header class="p-6 border-b bg-white/[0.01]" :style="{ borderColor: store.currentTheme?.colors.border }">
              <h3 class="text-xl font-bold tracking-tight" :style="{ color: store.currentTheme?.sidebar.accent }">Theme Engine Management</h3>
            </header>
            <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
              <button
                  v-for="theme in themesList" :key="theme.id"
                  @click="store.setTheme(theme.id)"
                  class="p-5 border transition-all hover:brightness-110 text-left rounded flex flex-col gap-4 outline-none shadow-sm"
                  :style="{
                  backgroundColor: theme.background,
                  borderColor: store.currentTheme?.id === theme.id
                    ? (Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited)
                    : 'rgba(255,255,255,0.05)'
                }"
              >
                <span class="flex justify-between items-center w-full">
                  <span class="w-8 h-8 rounded bg-white/5 flex items-center justify-center border border-white/5 text-sm shadow-inner transition-colors" :style="{ color: store.currentTheme?.sidebar.accent }">
                    {{ theme.id === 'wooden' ? '🪵' : '✨' }}
                  </span>
                  <span v-if="store.currentTheme?.id === theme.id" class="text-[9px] font-black uppercase tracking-widest" :style="{ color: Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited }">Selected</span>
                </span>
                <span class="flex flex-col gap-0.5">
                  <span class="text-sm font-bold uppercase transition-colors" :style="{ color: theme.id === 'wooden' ? '#2b1a10' : '#fff' }">{{ theme.name }}</span>
                  <span class="text-[9px] font-mono opacity-30 uppercase" :style="{ color: theme.id === 'wooden' ? '#2b1a10' : '#fff' }">{{ theme.id }}.theme_config</span>
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </main>
    </div>

    <footer class="h-6 border-t flex items-center px-4 justify-between select-none transition-colors duration-500" :style="{ backgroundColor: store.currentTheme?.sidebar.bg, borderColor: store.currentTheme?.sidebar.border }">
      <span class="text-[10px] font-mono tracking-tight uppercase italic opacity-40" :style="{ color: store.currentTheme?.sidebar.text }">Admin level: local\navigator</span>
      <span class="text-[10px] font-mono opacity-20" :style="{ color: store.currentTheme?.sidebar.accent }">Process: travel_map_core.exe | 0x824</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLangStore } from '@/stores/langStore'
import { useMapStore } from '@/stores/mapStore'
import { useUiStore } from '@/stores/uiStore'
import { MAP_THEMES } from '@/shared/map-themes'
import { LangSwitcher } from '@/shared/ui/LangSwitcher'

const router = useRouter()
const langStore = useLangStore()
const store = useMapStore()
const uiStore = useUiStore()
const themesList = Object.values(MAP_THEMES)

const activeTabId = ref<string | null>(null)

const tabs = [
  { id: 'general', icon: '📁', nameRu: 'Общие параметры', nameEn: 'General Settings' },
  { id: 'themes', icon: '🎨', nameRu: 'Стили интерфейса', nameEn: 'Interface Styles' },
  { id: 'users', icon: '👤', nameRu: 'Пользователи', nameEn: 'Local Users' },
  { id: 'storage', icon: '💾', nameRu: 'Хранилище данных', nameEn: 'Disk Management' }
]

onMounted(() => {
  if (uiStore.isSidebarOpen) {
    uiStore.toggleSidebar()
  }
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(155, 155, 155, 0.2);
  border-radius: 10px;
}
</style>