<template>
  <div class="w-full h-full p-12 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans transition-colors duration-1000" :style="{ backgroundColor: store.currentTheme?.background }">

    <!-- ХЕДЕР И БАЛАНС (МИНИ-БИЛЕТ) -->
    <header class="flex justify-between items-center">
      <div class="flex flex-col gap-2">
        <h1 class="text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
          {{ langStore.currentLang === 'ru' ? 'Магазин' : 'Style Shop' }}
        </h1>
        <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40 text-white">Visual Engine Marketplace</span>
      </div>

      <!-- Кошелек в стиле билета -->
      <div class="flex overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-105">
        <div class="bg-[#3b82f6] px-4 py-8 flex items-center justify-center border-r border-white/10">
          <span class="[writing-mode:vertical-lr] rotate-180 text-[8px] font-black uppercase tracking-[0.4em] text-white/60">Tickets</span>
        </div>
        <div class="bg-white px-8 py-6 flex flex-col items-center justify-center gap-1">
          <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest leading-none">Balance</span>
          <span class="text-4xl font-black text-slate-900 leading-none tracking-tighter">{{ userStore.balance }}</span>
        </div>
        <div class="bg-white border-l-2 border-dashed border-slate-200 px-4 py-6 flex items-center justify-center">
          <span class="text-2xl">🎟️</span>
        </div>
      </div>
    </header>

    <!-- СЕКЦИЯ 1: ТВОЯ КОЛЛЕКЦИЯ -->
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
            <span v-if="store.currentTheme?.id === theme.id" class="px-4 py-1.5 rounded-full bg-blue-500 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              In Use
            </span>
          </div>
          <span class="flex flex-col gap-1">
            <span class="text-2xl font-black uppercase tracking-tight text-white">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-30 uppercase tracking-widest text-white">Travel License: Granted</span>
          </span>
        </button>
      </div>
    </section>

    <!-- СЕКЦИЯ 2: РЫНОК -->
    <section v-if="availableThemes.length > 0" class="flex flex-col gap-8">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Терминал покупки' : 'Booking Terminal' }}
        </h2>
        <div class="h-[1px] flex-1 bg-white/5"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="theme in availableThemes" :key="theme.id"
            class="p-10 rounded-[48px] border border-white/5 bg-black/20 flex flex-col gap-8 relative overflow-hidden group shadow-xl"
        >
          <div class="flex justify-between items-center w-full relative z-10">
            <span class="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl bg-white/[0.02] border border-white/5 grayscale">
               {{ theme.id === 'wooden' ? '🪵' : '✨' }}
            </span>
            <span class="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Restricted</span>
          </div>

          <span class="flex flex-col gap-1 relative z-10">
            <span class="text-2xl font-black uppercase tracking-tight text-white/40">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-10 uppercase tracking-widest text-white">Exchange tickets to unlock</span>
          </span>

          <!-- КНОПКА ПОКУПКИ (БИЛЕТЫ) -->
          <button
              @click="userStore.buyTheme(theme.id, theme.price || 0)"
              :disabled="userStore.balance < (theme.price || 0)"
              class="w-full py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 border shadow-2xl relative z-10 outline-none cursor-pointer"
              :class="userStore.balance >= (theme.price || 0)
                ? 'bg-white text-black border-transparent hover:bg-blue-500 hover:text-white'
                : 'bg-red-500/5 border-red-500/20 text-red-500/40 cursor-not-allowed'"
          >
            <div class="flex items-center gap-2">
              <span class="text-xs font-black uppercase tracking-[0.2em]">
                {{ theme.price || 0 }} 🎫
              </span>
              <span v-if="userStore.balance < (theme.price || 0)" class="text-[9px] font-bold opacity-60 italic">
                ({{ langStore.currentLang === 'ru' ? 'Нужно еще' : 'Missing' }} {{ (theme.price || 0) - userStore.balance }})
              </span>
            </div>
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

const store = useMapStore()
const langStore = useLangStore()
const userStore = useUserStore()

const themesList = computed(() => {
  return Object.values(store.themes)
})

const ownedThemes = computed(
    () => themesList.value.filter((t) => userStore.purchasedThemes.includes(t.id))
)

const availableThemes = computed(
    () => themesList.value.filter((t) => !userStore.purchasedThemes.includes(t.id))
)
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>