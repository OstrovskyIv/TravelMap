<template>
  <div class="flex p-1 border backdrop-blur-xl rounded-2xl transition-all duration-500" :style="{ backgroundColor: theme?.langSwitcher.bg, borderColor: theme?.langSwitcher.border }">
    <button @click="langStore.setLang('ru')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
        :style="langStore.currentLang === 'ru'
        ? { backgroundColor: theme?.langSwitcher.activeBg, color: theme?.langSwitcher.activeText }
        : { color: theme?.langSwitcher.text }">
      RU
    </button>

    <button @click="langStore.setLang('en')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300"
        :style="langStore.currentLang === 'en'
        ? { backgroundColor: theme?.langSwitcher.activeBg, color: theme?.langSwitcher.activeText }
        : { color: theme?.langSwitcher.text }">
      EN
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLangStore } from '@/stores/langStore'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{ theme: MapTheme | undefined }>()
const langStore = useLangStore()
</script>