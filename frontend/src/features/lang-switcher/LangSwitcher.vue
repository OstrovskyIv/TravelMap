<template>
  <div class="flex p-1 border backdrop-blur-xl rounded-2xl transition-all duration-500 bg-[var(--ui-active-bg)] border-[var(--ui-border)]">
    <button @click="langStore.setLang('ru')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-none cursor-pointer"
            :style="langStore.currentLang === 'ru'
        ? { backgroundColor: 'var(--ui-accent)', color: 'black' }
        : { backgroundColor: 'transparent', color: 'var(--ui-text-muted)' }">
      RU
    </button>

    <button @click="langStore.setLang('en')" class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 border-none cursor-pointer"
            :style="langStore.currentLang === 'en'
        ? { backgroundColor: 'var(--ui-accent)', color: 'black' }
        : { backgroundColor: 'transparent', color: 'var(--ui-text-muted)' }">
      EN
    </button>
  </div>
</template>

<script setup lang="ts">
const langStore = useLangStore()
</script>