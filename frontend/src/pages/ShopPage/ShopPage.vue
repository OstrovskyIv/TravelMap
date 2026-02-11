<template>
  <div class="w-full h-full p-12 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans transition-colors duration-1000" :style="{ backgroundColor: store.currentTheme?.background }">

    <!-- ХЕДЕР И БАЛАНС -->
    <header class="flex justify-between items-start">
      <div class="flex flex-col gap-2">
        <h1 class="text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
          {{ langStore.currentLang === 'ru' ? 'Магазин' : 'Style Shop' }}
        </h1>
        <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40 text-white">Visual Engine Marketplace</span>
      </div>

      <!-- Кошелек: Стиль как у счетчика на карте -->
      <div class="flex flex-col gap-2 items-end p-8 bg-[#18181b]/80 border border-[#fbbf24]/20 rounded-[40px] backdrop-blur-xl shadow-2xl">
        <span class="text-[10px] font-black uppercase tracking-[0.3em] text-[#fbbf24]">Available Stars</span>
        <div class="flex items-center gap-4">
          <span class="text-5xl font-black text-white leading-none tracking-tighter">{{ userStore.balance }}</span>
          <span class="text-3xl animate-pulse">⭐</span>
        </div>
      </div>
    </header>

    <!-- СЕКЦИЯ 1: ТВОЯ КОЛЛЕКЦИЯ (КУПЛЕННЫЕ) -->
    <section class="flex flex-col gap-8">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Твоя коллекция' : 'Your Collection' }}
        </h2>
        <div class="h-[1px] flex-1 bg-white/5"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button
            v-for="theme in ownedThemes" :key="theme.id"
            @click="store.setTheme(theme.id)"
            class="p-10 rounded-[48px] border transition-all duration-500 flex flex-col gap-8 group hover:scale-[1.02] text-left outline-none relative overflow-hidden"
            :style="{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderColor: store.currentTheme?.id === theme.id ? theme.colors.ui.accent : 'rgba(255,255,255,0.1)'
          }"
        >
          <div class="flex justify-between items-center w-full">
            <span class="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl bg-white/5 border border-white/5 shadow-2xl">
              {{ theme.id === 'wooden' ? '🪵' : '✨' }}
            </span>
            <span v-if="store.currentTheme?.id === theme.id" class="px-4 py-1.5 rounded-full bg-[#fbbf24] text-[9px] font-black uppercase tracking-widest text-black shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              Equipped
            </span>
          </div>
          <span class="flex flex-col gap-1">
            <span class="text-2xl font-black uppercase tracking-tight text-white">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-30 uppercase tracking-widest text-white">License: Granted</span>
          </span>
        </button>
      </div>
    </section>

    <!-- СЕКЦИЯ 2: РЫНОК (НЕ КУПЛЕННЫЕ) -->
    <section v-if="availableThemes.length > 0" class="flex flex-col gap-8">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Доступно в магазине' : 'Marketplace' }}
        </h2>
        <div class="h-[1px] flex-1 bg-white/5"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="theme in availableThemes" :key="theme.id"
            class="p-10 rounded-[48px] border border-white/5 bg-black/20 flex flex-col gap-8 relative overflow-hidden group shadow-xl"
        >
          <!-- Эффект заблокированного контента -->
          <div class="flex justify-between items-center w-full relative z-10">
            <span class="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl bg-white/[0.02] border border-white/5 grayscale">
               {{ theme.id === 'wooden' ? '🪵' : '✨' }}
            </span>
            <span class="text-[10px] font-black text-white/20 uppercase tracking-widest">Locked</span>
          </div>

          <span class="flex flex-col gap-1 relative z-10">
            <span class="text-2xl font-black uppercase tracking-tight text-white/40">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-10 uppercase tracking-widest text-white">Requires purchase</span>
          </span>

          <!-- Кнопка покупки -->
          <button
              @click="userStore.buyTheme(theme.id, theme.price)"
              class="w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border border-transparent shadow-2xl relative z-10"
              :class="userStore.balance >= theme.price ? 'bg-white text-black hover:bg-[#fbbf24]' : 'bg-white/5 text-white/20 cursor-not-allowed'"
          >
            <span class="text-xs font-black uppercase tracking-[0.2em]">
              {{ userStore.balance >= theme.price ? `${theme.price}` : 'Need funds' }}
            </span>
            <span v-if="userStore.balance >= theme.price" class="text-sm">⭐</span>
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { useUserStore } from '@/stores/userStore'
import { MAP_THEMES } from '@/shared/map-themes'

const store = useMapStore()
const langStore = useLangStore()
const userStore = useUserStore()
const themesList = Object.values(MAP_THEMES)

const ownedThemes = computed(() => {
  return themesList.filter((t) => userStore.purchasedThemes.includes(t.id))
})

const availableThemes = computed(() => {
  return themesList.filter((t) => !userStore.purchasedThemes.includes(t.id))
})
</script>