<template>
  <div class="w-full h-full p-8 lg:p-12 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
    <header class="flex flex-col gap-1">
      <h3 class="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Theme Management</h3>
      <p class="text-[10px] font-mono text-white/20 uppercase tracking-widest">Visual Engine Core Permissions</p>
    </header>

    <div class="flex flex-col gap-3">
      <div v-for="t in Object.values(mapStore.themes)" :key="t.id"
           class="p-5 bg-white/5 border border-white/10 rounded-[28px] flex items-center justify-between gap-6 group hover:bg-white/[0.07] transition-all">

        <div class="flex items-center gap-6 min-w-0">
          <span class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl shadow-inner text-white">
            {{ t.id === 'wooden' ? '🪵' : '✨' }}
          </span>

          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full" :class="userStore.purchasedThemes.includes(t.id) ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'"></div>
              <span class="text-sm font-black uppercase tracking-tight text-white">{{ t.name }}</span>
            </div>
            <span class="text-[8px] font-mono text-white/20 uppercase">ID: {{ t.id }} // STATUS: {{ userStore.purchasedThemes.includes(t.id) ? 'GRANTED' : 'LOCKED' }}</span>
          </div>
        </div>

        <div class="flex gap-2 shrink-0">
          <button v-if="userStore.purchasedThemes.includes(t.id) && t.id !== 'classic'" @click="userStore.lockTheme(t.id)" class="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] font-black uppercase border-none cursor-pointer">Lock</button>
          <button v-if="!userStore.purchasedThemes.includes(t.id)" @click="userStore.unlockTheme(t.id)" class="px-4 py-2 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all text-[10px] font-black uppercase border-none cursor-pointer">Grant</button>
          <button @click="mapStore.setTheme(t.id)" class="px-4 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-[10px] font-black uppercase border-none cursor-pointer">Equip</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const userStore = useUserStore()
</script>