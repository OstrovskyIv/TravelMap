<template>
  <div class="w-full h-full p-12 flex flex-col gap-12 overflow-y-auto font-sans transition-colors duration-1000" :style="{ backgroundColor: store.currentTheme?.background }">
    <header class="flex flex-col gap-2">
      <h1 class="text-6xl font-black uppercase tracking-tighter italic text-white">
        {{ langStore.currentLang === 'ru' ? 'Настройки' : 'Settings' }}
      </h1>
      <span class="text-[10px] font-mono uppercase tracking-[0.5em] opacity-40 text-white">System Environment Configuration</span>
    </header>

    <div class="flex flex-col gap-10 max-w-2xl">
      <!-- КАРТОЧКА ЛОКАЛИЗАЦИИ -->
      <section class="flex flex-col gap-8 p-12 bg-white/[0.03] border border-white/5 rounded-[56px] backdrop-blur-3xl shadow-2xl transition-all">
        <header class="flex items-center gap-6">
          <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner">🌍</div>
          <div class="flex flex-col gap-1">
            <h3 class="text-xl font-black uppercase tracking-tight text-white">Localization</h3>
            <span class="text-[10px] opacity-30 font-mono uppercase tracking-widest text-white">Set primary system language</span>
          </div>
        </header>

        <div class="w-full max-w-[240px]">
          <LangSwitcher :theme="store.currentTheme" />
        </div>
      </section>

      <div class="p-8 border border-white/5 rounded-[32px] opacity-20 flex justify-between items-center text-white">
        <span class="text-[9px] font-black uppercase tracking-[0.4em]">Build Protocol</span>
        <span class="text-[9px] font-mono tracking-tighter">v4.0.2 Stable Release</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { LangSwitcher } from '@/shared/ui/LangSwitcher'

const store = useMapStore()
const langStore = useLangStore()
</script>