<template>
  <div class="w-full h-full p-12 flex flex-col gap-12 overflow-y-auto custom-scrollbar font-sans" :style="{ backgroundColor: store.currentTheme?.background }">
    <header class="flex flex-col gap-2">
      <h1 class="text-6xl font-black uppercase tracking-tighter italic" :style="{ color: store.currentTheme?.sidebar.accent }">
        {{ langStore.currentLang === 'ru' ? 'Магазин стилей' : 'Style Shop' }}
      </h1>
      <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40">Upgrade your visual experience</span>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <button
          v-for="theme in themesList" :key="theme.id"
          @click="store.setTheme(theme.id)"
          class="p-8 rounded-[40px] border transition-all duration-500 flex flex-col gap-8 group hover:scale-[1.03] text-left outline-none"
          :style="{
          backgroundColor: theme.sidebar.bg,
          borderColor: store.currentTheme?.id === theme.id ? (Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited) : 'rgba(255,255,255,0.05)'
        }"
      >
        <span class="flex justify-between items-center w-full">
          <span class="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-2xl transition-transform group-hover:rotate-12" :style="{ backgroundColor: Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited }">
            {{ theme.id === 'wooden' ? '🪵' : '✨' }}
          </span>
          <span v-if="store.currentTheme?.id === theme.id" class="px-4 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-widest">Active</span>
        </span>
        <span class="flex flex-col gap-1">
          <span class="text-2xl font-black uppercase tracking-tight">{{ theme.name }}</span>
          <span class="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em]">{{ theme.id }}_v4.sys</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { MAP_THEMES } from '@/shared/map-themes'

const store = useMapStore()
const langStore = useLangStore()
const themesList = Object.values(MAP_THEMES)
</script>