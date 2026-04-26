<template>
  <div class="w-full h-full p-16 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans bg-[var(--bg-main)] text-white">
    <header class="flex justify-between items-end">
      <div class="flex items-center gap-10">
        <div class="relative">
          <div v-if="userStore.activeHat" class="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl z-10 drop-shadow-2xl">{{ userStore.activeHat }}</div>
          <div class="w-40 h-40 rounded-[64px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-7xl font-black italic relative z-0" :class="userStore.isVip ? 'border-yellow-500/50 shadow-2xl shadow-yellow-500/10' : ''">
            {{ userStore.userName.charAt(0) }}
          </div>
          <div v-if="userStore.activeEmoji" class="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center text-2xl shadow-xl">{{ userStore.activeEmoji }}</div>
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <h1 class="text-6xl font-black uppercase italic tracking-tighter leading-none">{{ userStore.userName }}</h1>
            <span class="text-xs font-mono uppercase tracking-[0.5em] text-[var(--ui-accent)] opacity-50 italic">Verified Traveler Node</span>
          </div>
          <div v-if="userStore.isVip" class="flex items-center gap-3 px-5 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 w-fit">
            <span class="text-yellow-500 text-xs">👑</span>
            <span class="text-[9px] font-black uppercase text-yellow-500 tracking-widest italic">Vip Identity Active</span>
          </div>
        </div>
      </div>

      <div class="flex gap-6">
        <div v-for="stat in stats" :key="stat.label" class="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-1 min-w-[160px]">
          <span class="text-[9px] font-black uppercase text-white/20 tracking-widest italic">{{ stat.label }}</span>
          <span class="text-3xl font-black italic tracking-tighter text-[var(--ui-accent)]">{{ stat.val }}</span>
        </div>
      </div>
    </header>

    <div class="grid grid-cols-2 gap-10 pb-20">
      <section class="flex flex-col gap-6">
        <h3 class="text-xs font-black uppercase tracking-[0.5em] text-white/20 italic flex items-center gap-4">
          <span class="w-12 h-[1px] bg-white/10"></span> Collection Inventory
        </h3>
        <div class="p-10 rounded-[48px] bg-white/[0.02] border border-white/5 flex flex-wrap gap-4">
          <div v-for="themeId in userStore.purchasedThemes" :key="themeId" class="px-6 py-3 rounded-xl bg-white/5 border border-white/5 text-[10px] font-black uppercase italic text-white/60 hover:text-white transition-all cursor-default">
            Theme: {{ themeId }}
          </div>
          <div v-for="emoji in userStore.purchasedEmojis" :key="emoji" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl">
            {{ emoji }}
          </div>
          <div v-for="hat in userStore.purchasedHats" :key="hat" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-2xl">
            {{ hat }}
          </div>
        </div>
      </section>

      <section class="flex flex-col gap-6">
        <h3 class="text-xs font-black uppercase tracking-[0.5em] text-white/20 italic flex items-center gap-4">
          <span class="w-12 h-[1px] bg-white/10"></span> Activity Log
        </h3>
        <div class="flex-1 rounded-[48px] border border-dashed border-white/5 flex items-center justify-center italic text-white/10 text-xs">Registry activity data loading...</div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore(); const mapStore = useMapStore(); const langStore = useLangStore()
const stats = computed(() => [
  { label: langStore.currentLang === 'ru' ? 'Регионы' : 'Regions', val: mapStore.unlockedCountries.length },
  { label: langStore.currentLang === 'ru' ? 'Дистанция' : 'Distance', val: mapStore.totalDistance + ' KM' },
  { label: langStore.currentLang === 'ru' ? 'Билеты' : 'Credits', val: userStore.balance }
])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>