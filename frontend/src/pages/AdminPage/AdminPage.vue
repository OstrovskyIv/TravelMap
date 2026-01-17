<template>
  <div class="fixed inset-0 z-[60] flex bg-[#0c0c0e] text-white font-sans overflow-hidden">

    <button
        @click="router.push('/')"
        class="absolute top-6 right-8 z-50 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-2xl backdrop-blur-xl"
    >
      {{ langStore.currentLang === 'ru' ? 'Выйти из панели' : 'Exit Console' }}
    </button>

    <aside class="w-72 h-full border-r border-white/5 flex flex-col bg-white/[0.01]">
      <header class="p-8 pb-4 flex flex-col gap-1">
        <h2 class="text-lg font-black uppercase tracking-tighter italic text-blue-500">System</h2>
        <div class="h-[1px] w-8 bg-white/10"></div>
      </header>

      <nav class="flex-1 overflow-y-auto p-4 flex flex-col gap-1 custom-scrollbar">
        <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTabId = tab.id"
            class="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 group text-left"
            :class="activeTabId === tab.id ? 'bg-white/5 shadow-inner' : 'hover:bg-white/[0.03]'"
        >
          <span class="text-xl transition-transform group-hover:scale-110">{{ tab.icon }}</span>
          <span class="flex flex-col gap-0.5">
            <span class="text-[11px] font-bold uppercase tracking-wider" :class="activeTabId === tab.id ? 'text-white' : 'text-stone-500 group-hover:text-stone-300'">
              {{ langStore.currentLang === 'ru' ? tab.nameRu : tab.nameEn }}
            </span>
            <span class="text-[8px] font-mono opacity-20 uppercase tracking-tighter">Module 0x{{ tab.id.charAt(0) }}</span>
          </span>
        </button>
      </nav>
    </aside>

    <main class="flex-1 h-full relative overflow-hidden bg-black/20">
      <Transition
          mode="out-in"
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="opacity-0 translate-x-4"
          leave-active-class="transition-all duration-300 ease-in"
          leave-to-class="opacity-0 -translate-x-4"
      >
        <div v-if="!activeTabId" class="w-full h-full flex flex-col items-center justify-center gap-6">
          <div class="w-12 h-12 border-2 border-white/5 border-t-blue-500 rounded-full animate-spin"></div>
          <div class="flex flex-col items-center gap-1">
            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Waiting for command</span>
            <p class="text-[9px] text-stone-600 font-mono italic">Select a module from the left panel to begin configuration</p>
          </div>
        </div>

        <div v-else-if="activeTabId === 'general'" class="w-full h-full p-16 flex flex-col gap-12 overflow-y-auto custom-scrollbar">
          <header class="flex flex-col gap-2">
            <h3 class="text-5xl font-black tracking-tighter uppercase italic drop-shadow-2xl">General</h3>
            <div class="h-1 w-20 bg-blue-600 rounded-full"></div>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-10 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col gap-6 backdrop-blur-3xl shadow-2xl">
              <span class="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em]">Language Engine</span>
              <LangSwitcher :theme="mapStore.currentTheme" />
            </div>

            <div class="p-10 bg-white/[0.03] border border-white/5 rounded-[40px] flex flex-col gap-4 backdrop-blur-3xl shadow-2xl justify-center">
              <span class="text-[10px] font-black text-stone-500 uppercase tracking-[0.3em]">Core Status</span>
              <div class="flex items-center gap-4">
                <div class="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                <span class="text-sm font-black tracking-tight">ENCRYPTED CONNECTION OK</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTabId === 'themes'" class="w-full h-full p-16 flex flex-col gap-12 overflow-y-auto custom-scrollbar">
          <header class="flex flex-col gap-2">
            <h3 class="text-5xl font-black tracking-tighter uppercase italic drop-shadow-2xl">Environment</h3>
            <div class="h-1 w-20 bg-amber-500 rounded-full"></div>
          </header>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
                v-for="theme in themesList" :key="theme.id"
                @click="mapStore.setTheme(theme.id)"
                class="p-8 rounded-[40px] border transition-all duration-500 cursor-pointer flex flex-col gap-8 group hover:scale-[1.03] shadow-xl"
                :style="{
                backgroundColor: theme.background,
                borderColor: mapStore.currentTheme?.id === theme.id
                  ? (Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited)
                  : 'rgba(255,255,255,0.05)'
              }"
            >
              <div class="flex justify-between items-start">
                <div class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-2xl" :style="{ backgroundColor: Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited }">
                  {{ theme.id === 'wooden' ? '🪵' : '✨' }}
                </div>
                <div v-if="mapStore.currentTheme?.id === theme.id" class="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                  <span class="text-[8px] font-black uppercase tracking-widest text-white">Active</span>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <h4 class="text-xl font-black uppercase tracking-tight">{{ theme.name }}</h4>
                <span class="text-[9px] font-mono opacity-30 uppercase tracking-widest">{{ theme.id }}_protocol.sys</span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </main>
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
const mapStore = useMapStore()
const uiStore = useUiStore()
const themesList = Object.values(MAP_THEMES)

const activeTabId = ref<string | null>(null)

const tabs = [
  { id: 'general', icon: '🛠️', nameRu: 'Общее', nameEn: 'General' },
  { id: 'themes', icon: '🎨', nameRu: 'Оформление', nameEn: 'Themes' },
  { id: 'users', icon: '👥', nameRu: 'Доступ', nameEn: 'Access' }
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
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}
</style>