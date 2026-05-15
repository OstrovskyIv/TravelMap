<template>
  <div class="w-full h-full p-8 md:p-16 overflow-y-auto custom-scrollbar font-sans bg-[var(--bg-main)] text-white">
    <header class="flex flex-col items-center gap-6 mb-20 text-center">
      <h1 class="text-7xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
        {{ langStore.t.leaderboard.title }}
      </h1>
      <div class="flex p-1 bg-white/5 border border-white/5 rounded-2xl">
        <button v-for="m in ['users', 'countries', 'cities']" :key="m" @click="mode = m"
                class="px-8 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-none cursor-pointer"
                :class="mode === m ? 'bg-[var(--ui-accent)] text-black shadow-lg' : 'text-white/40'">
          {{ langStore.t.leaderboard[m] }}
        </button>
      </div>
    </header>

    <div class="flex items-end justify-center gap-4 md:gap-12 mb-24 min-h-[400px]">
      <div v-for="pos in [2, 1, 3]" :key="pos" class="flex flex-col items-center group" :class="pos === 1 ? 'scale-110 z-10' : ''">
        <template v-if="sortedList[pos-1]">
          <div class="relative mb-6">
            <div class="absolute inset-0 blur-[40px] opacity-20" :style="{ backgroundColor: pos === 1 ? '#fbbf24' : pos === 2 ? '#94a3b8' : '#78350f' }"></div>
            <div class="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 flex items-center justify-center text-5xl bg-zinc-900 overflow-hidden shadow-2xl"
                 :style="{ borderColor: pos === 1 ? '#fbbf24' : pos === 2 ? '#94a3b8' : '#78350f' }">
              {{ mode === 'users' ? (sortedList[pos-1].active_emoji || '👤') : getFlag(sortedList[pos-1].id) }}
            </div>
            <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl" :class="pos === 1 ? 'animate-bounce' : ''">
              {{ pos === 1 ? '👑' : pos === 2 ? '🥈' : '🥉' }}
            </div>
          </div>
          <div class="text-center mb-4">
            <p class="font-black uppercase italic text-sm md:text-lg leading-none">{{ getName(sortedList[pos-1]) }}</p>
            <p class="text-[10px] font-mono text-[var(--ui-accent)] mt-1">{{ formatVal(sortedList[pos-1].value) }}</p>
          </div>
          <div :class="['w-28 md:w-40 bg-white/5 rounded-t-[32px] border-x border-t border-white/10 flex flex-col items-center justify-end pb-8',
                       pos === 1 ? 'h-64 bg-gradient-to-t from-[var(--ui-accent)]/20 to-[var(--ui-accent)]/40' : pos === 2 ? 'h-40' : 'h-32']">
            <span class="text-6xl font-black opacity-10 italic">{{ pos }}</span>
          </div>
        </template>
      </div>
    </div>

    <!-- СПИСОК 4+ -->
    <div class="max-w-4xl mx-auto flex flex-col gap-4">
      <div v-for="(item, idx) in sortedList.slice(3)" :key="idx"
           class="flex items-center justify-between p-6 bg-white/[0.02] rounded-[32px] border border-white/5 hover:bg-white/5 transition-all">
        <div class="flex items-center gap-8">
          <span class="text-2xl font-black italic opacity-20 w-10">#{{ idx + 4 }}</span>
          <div class="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl italic">
            {{ mode === 'users' ? (item.active_emoji || '👤') : getFlag(item.id) }}
          </div>
          <span class="text-xl font-bold uppercase italic tracking-tight">{{ getName(item) }}</span>
        </div>
        <div class="text-right">
           <span class="text-[9px] font-black uppercase opacity-30 block">
             {{ mode === 'users' ? langStore.t.leaderboard.balance : langStore.t.leaderboard.score }}
           </span>
          <span class="text-3xl font-black italic text-[var(--ui-accent)]">{{ formatVal(item.value) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@shared/api'; import { onMounted, ref, computed } from 'vue'; import { ALL_COUNTRIES } from '@entities/country/model'
import { useLangStore } from '@features/lang-switcher/model/langStore'
const mode = ref('users'); const pilots = ref<any[]>([]); const countries = ref<any[]>([]); const cities = ref<any[]>([])
const langStore = useLangStore()

const load = async () => {
  try {
    const [p, c, ci] = await Promise.all([api.get('/users/leaderboard'), api.get('/map/leaderboard/countries'), api.get('/map/leaderboard/cities')])
    pilots.value = p.data; countries.value = c.data; cities.value = ci.data
  } catch(e) { console.error(e) }
}
onMounted(load)

const sortedList = computed(() => {
  if (mode.value === 'users') return pilots.value.map(p => ({...p, value: p.balance}))
  if (mode.value === 'countries') return countries.value
  return cities.value
})

const getName = (entry: any) => {
  if (!entry) return ''
  if (mode.value === 'users') return entry.username
  const countryFound = ALL_COUNTRIES.find(c => c.id === entry.id)
  if (countryFound) return countryFound.names[langStore.currentLang]
  for (const c of ALL_COUNTRIES) {
    const city = c.cities.find(ct => ct.id === entry.id)
    if (city) return city.names[langStore.currentLang]
  }
  return entry.id
}

const getFlag = (id: string) => {
  const found = ALL_COUNTRIES.find(c => c.id === id)
  if (found) return found.flag
  for (const c of ALL_COUNTRIES) {
    if (c.cities.some(ct => ct.id === id)) return '🏙️'
  }
  return '🌍'
}
const formatVal = (val: any) => mode.value === 'users' ? Math.round(val) : Number(val || 0).toFixed(1)
</script>