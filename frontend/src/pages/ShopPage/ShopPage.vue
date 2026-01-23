<template>
  <div class="w-full h-full p-12 flex flex-col gap-12 overflow-y-auto custom-scrollbar font-sans transition-colors duration-1000" :style="{ backgroundColor: store.currentTheme?.background }">
    <header class="flex flex-col gap-2">
      <h1 class="text-6xl font-black uppercase tracking-tighter italic" :style="{ color: store.currentTheme?.sidebar.accent }">
        {{ langStore.currentLang === 'ru' ? 'Магазин' : 'Style Shop' }}
      </h1>
      <span class="text-[10px] font-mono uppercase tracking-[0.5em] opacity-40 text-white">Visual Engine Upgrade</span>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- КАРТОЧКА СТИЛЯ -->
      <button
          v-for="theme in themesList" :key="theme.id"
          @click="store.setTheme(theme.id)"
          class="p-10 rounded-[48px] border transition-all duration-500 flex flex-col gap-8 group hover:scale-[1.02] text-left outline-none relative overflow-hidden"
          :style="{
          backgroundColor: theme.id === 'wooden' ? theme.background : 'rgba(255,255,255,0.03)',
          borderColor: store.currentTheme?.id === theme.id ? theme.colors.ui.accent : 'rgba(255,255,255,0.05)'
        }"
      >
        <!-- Эффект свечения для активной темы -->
        <div v-if="store.currentTheme?.id === theme.id" class="absolute -top-24 -right-24 w-48 h-48 rounded-full blur-[80px] opacity-20" :style="{ backgroundColor: theme.colors.ui.accent }"></div>

        <div class="flex justify-between items-center w-full relative z-10">
          <span class="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-2xl transition-transform group-hover:rotate-12" :style="{ backgroundColor: theme.colors.ui.activeBg }">
            {{ theme.id === 'wooden' ? '🪵' : '✨' }}
          </span>
          <span v-if="store.currentTheme?.id === theme.id" class="px-4 py-1 rounded-full bg-white/10 text-[9px] font-black uppercase tracking-widest text-white">In Use</span>
        </div>

        <div class="flex flex-col gap-1 relative z-10">
          <span class="text-2xl font-black uppercase tracking-tight text-white">{{ theme.name }}</span>
          <span class="text-[10px] font-mono opacity-30 uppercase tracking-[0.2em] text-white">{{ theme.id }}_logic.v4</span>
        </div>
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