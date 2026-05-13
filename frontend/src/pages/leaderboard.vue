<template>
  <div class="w-full h-full p-8 md:p-16 overflow-y-auto custom-scrollbar font-sans bg-[var(--bg-main)] text-white">
    <header class="flex flex-col gap-2 mb-16">
      <h1 class="text-7xl font-black uppercase italic tracking-tighter leading-none">{{ langStore.t.leaderboard.title }}</h1>
      <p class="text-xs font-mono text-[var(--ui-accent)] uppercase tracking-[0.5em] opacity-50 italic">Global_Node_Rankings_v4.0</p>
    </header>

    <div class="max-w-5xl flex flex-col gap-4">
      <div v-for="(pilot, index) in leaders" :key="pilot.id"
           class="group flex items-center justify-between p-8 rounded-[40px] border transition-all duration-500"
           :class="pilot.username === userStore.userName ? 'bg-[var(--ui-accent)] text-black border-none scale-[1.02] shadow-2xl' : 'bg-white/[0.02] border-white/5 hover:bg-white/5'">

        <div class="flex items-center gap-10">
          <span class="text-3xl font-black italic w-12 opacity-20">#{{ index + 1 }}</span>

          <div class="relative w-20 h-20 shrink-0">
            <div v-if="pilot.active_hat" class="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl z-10 drop-shadow-2xl">{{ pilot.active_hat }}</div>
            <div class="w-full h-full rounded-[30px] flex items-center justify-center text-4xl font-black italic bg-white/10"
                 :class="pilot.username === userStore.userName ? 'bg-black/20' : 'bg-white/5'">
              {{ pilot.active_emoji || pilot.username.charAt(0).toUpperCase() }}
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <span class="text-2xl font-black uppercase tracking-tight italic">{{ pilot.username }}</span>
            <div class="flex items-center gap-3">
              <span class="text-[9px] font-mono uppercase opacity-40 px-2 py-0.5 rounded bg-black/20">ID_{{ pilot.id.toString().padStart(4, '0') }}</span>
              <span v-if="pilot.is_vip" class="text-[9px] font-black uppercase text-yellow-500">VIP Identity</span>
            </div>
          </div>
        </div>

        <div class="flex gap-16 text-right">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black uppercase opacity-30 tracking-widest italic">Regions</span>
            <span class="text-4xl font-black italic tracking-tighter">{{ pilot.countries_count }}</span>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-black uppercase opacity-30 tracking-widest italic">Credits</span>
            <span class="text-4xl font-black italic tracking-tighter">{{ pilot.balance }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@shared/api'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@entities/user/model/userStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'

const langStore = useLangStore()
const userStore = useUserStore()
const leaders = ref<any[]>([])

onMounted(async () => {
  try {
    const { data } = await api.get('/users/leaderboard')
    leaders.value = data
  } catch (e) {
    console.error('Failed to load leaderboard')
  }
})
</script>