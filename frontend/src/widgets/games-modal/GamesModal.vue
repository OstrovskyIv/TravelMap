<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 scale-95">
    <div v-if="uiStore.isGamesModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-8 backdrop-blur-2xl bg-black/60 font-sans" @click.self="uiStore.setGamesModal(false)">
      <div class="w-full max-w-5xl h-[750px] flex flex-col overflow-hidden rounded-[48px] bg-zinc-900 border border-white/5 shadow-2xl text-white">

        <header class="p-8 border-b border-white/5 flex justify-between items-center shrink-0 bg-white/[0.02]">
          <div class="flex flex-col gap-1">
            <h2 class="text-3xl font-black uppercase italic tracking-tighter text-white leading-none">{{ langStore.t.games.title }}</h2>
            <span class="text-[9px] font-mono text-[var(--ui-accent)] uppercase tracking-[0.4em] opacity-50 italic">Entertainment_Registry_v1.0</span>
          </div>

          <div class="flex items-center gap-10">
            <div class="flex flex-col items-end gap-1 leading-none">
              <span class="text-[8px] font-black uppercase text-white/30 tracking-widest italic">Total Credits</span>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-black text-white italic tracking-tighter">{{ userStore.balance }}</span>
                <span class="text-xs font-black text-blue-500 uppercase italic">CR</span>
              </div>
            </div>
            <button @click="uiStore.setGamesModal(false)" class="w-14 h-14 rounded-2xl bg-white/5 text-white/40 hover:text-white border-none cursor-pointer flex items-center justify-center text-2xl transition-all">✕</button>
          </div>
        </header>

        <div class="flex-1 overflow-hidden flex">
          <aside class="w-80 border-r border-white/5 p-8 flex flex-col gap-3 bg-black/10">
            <button @click="activeGame = 'flag'" class="w-full p-6 rounded-[32px] flex flex-col gap-2 text-left border-none cursor-pointer transition-all group" :class="activeGame === 'flag' ? 'bg-white text-black shadow-2xl' : 'bg-white/5 text-white/40 hover:bg-white/10'">
              <span class="text-sm font-black uppercase italic tracking-tight">{{ langStore.t.games.guessFlag }}</span>
              <span class="text-[9px] font-bold opacity-40 uppercase italic group-hover:opacity-100 transition-opacity">Level 01 // Easy</span>
            </button>
            <div class="mt-auto p-6 rounded-[28px] border border-dashed border-white/10 flex items-center justify-center italic text-[9px] text-white/10 uppercase tracking-widest text-center">More Games Loading...</div>
          </aside>
          <main class="flex-1 p-12 overflow-y-auto custom-scrollbar flex items-center justify-center relative">
            <div class="absolute inset-0 bg-gradient-to-br from-[var(--ui-accent)]/5 to-transparent pointer-events-none"></div>
            <GuessFlagGame v-if="activeGame === 'flag'" />
          </main>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import GuessFlagGame from '@/features/games/GuessFlagGame.vue'
const uiStore = useUiStore(); const langStore = useLangStore(); const userStore = useUserStore()
const activeGame = ref('flag')
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>