<template>
  <div class="w-full h-full p-12 flex flex-col gap-12 overflow-y-auto font-sans" :style="{ backgroundColor: store.currentTheme?.background }">
    <header class="flex flex-col gap-2">
      <h1 class="text-6xl font-black uppercase tracking-tighter italic" :style="{ color: store.currentTheme?.sidebar.accent }">
        {{ langStore.currentLang === 'ru' ? 'Настройки' : 'Settings' }}
      </h1>
      <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40">System configuration</span>
    </header>

    <div class="flex flex-col gap-10 max-w-2xl">
      <section class="flex flex-col gap-6 p-10 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-3xl shadow-2xl">
        <header class="flex items-center gap-4">
          <span class="text-2xl">🌐</span>
          <div class="flex flex-col">
            <h3 class="text-xl font-black uppercase tracking-tight">Localization</h3>
            <span class="text-[10px] opacity-30 font-mono uppercase">Primary language engine</span>
          </div>
        </header>
        <LangSwitcher :theme="store.currentTheme" />
      </section>

      <div class="p-8 border border-white/5 rounded-[32px] opacity-40 flex justify-between items-center">
        <span class="text-[10px] font-black uppercase tracking-widest">Build Version</span>
        <span class="text-[10px] font-mono tracking-tighter text-blue-500">v4.0.2 Stable (Production)</span>
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