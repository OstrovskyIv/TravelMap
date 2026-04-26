<template>
  <div class="w-full flex flex-col gap-10 items-center font-sans">
    <div v-if="!currentCountry" class="flex flex-col gap-6 items-center">
      <div class="w-32 h-32 rounded-full bg-white/5 flex items-center justify-center text-6xl shadow-inner">🚩</div>
      <div class="flex flex-col items-center gap-1">
        <span class="text-xl font-black uppercase italic text-white">{{ langStore.t.games.guessFlag }}</span>
        <span class="text-[10px] opacity-30 font-mono uppercase tracking-widest text-white italic">{{ langStore.t.games.guessFlagDesc }}</span>
      </div>
      <button @click="startGame" class="px-12 py-4 rounded-2xl bg-[var(--ui-accent)] text-black font-black uppercase tracking-widest italic border-none cursor-pointer shadow-lg hover:scale-105 transition-all">
        {{ langStore.t.games.start }}
      </button>
    </div>

    <div v-else class="w-full flex flex-col gap-10 items-center text-white">
      <div class="flex flex-col items-center gap-4">
        <div class="flex items-center gap-3 px-6 py-2 rounded-full bg-green-500/10 border border-green-500/20">
          <span class="text-[10px] font-black uppercase text-green-500 italic tracking-widest">Session Rewards:</span>
          <span class="text-lg font-black text-white italic tracking-tighter">{{ sessionCredits }} 🎫</span>
        </div>
        <div class="text-9xl drop-shadow-2xl animate-pulse">{{ currentCountry.flag }}</div>
      </div>

      <div class="grid grid-cols-2 gap-4 w-full max-w-xl">
        <button
            v-for="option in options" :key="option.id"
            @click="handleAnswer(option.id)"
            :disabled="isAnswered"
            class="p-6 rounded-3xl border border-white/5 bg-white/[0.03] text-sm font-black uppercase italic transition-all border-none cursor-pointer text-white"
            :class="getButtonClass(option.id)"
        >
          {{ option.names[langStore.currentLang] }}
        </button>
      </div>

      <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-4">
        <div v-if="isAnswered" class="flex flex-col items-center gap-6">
          <div class="text-2xl font-black italic uppercase tracking-tighter" :class="selectedId === currentCountry.id ? 'text-green-500' : 'text-red-500'">
            {{ selectedId === currentCountry.id ? '+50 CREDITS' : 'WRONG NODE' }}
          </div>
          <button @click="startGame" class="px-12 py-4 rounded-2xl bg-white text-black font-black uppercase text-xs tracking-widest italic border-none cursor-pointer hover:scale-105 transition-all shadow-xl">
            {{ langStore.t.games.next }} ➝
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ALL_COUNTRIES } from '@entities/country/model'
import type { CountryData } from '@entities/country/model'

const langStore = useLangStore()
const userStore = useUserStore()

const currentCountry = ref<CountryData | null>(null)
const options = ref<CountryData[]>([])
const isAnswered = ref(false)
const selectedId = ref<string | null>(null)
const sessionCredits = ref(0)

const startGame = () => {
  if (!ALL_COUNTRIES.length) return
  isAnswered.value = false
  selectedId.value = null

  const randomIndex = Math.floor(Math.random() * ALL_COUNTRIES.length)
  const random = ALL_COUNTRIES[randomIndex]

  if (!random) return

  currentCountry.value = random
  const others = ALL_COUNTRIES.filter(c => c.id !== random.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

  options.value = [random, ...others].sort(() => 0.5 - Math.random())
}

const handleAnswer = (id: string) => {
  if (!currentCountry.value) return
  selectedId.value = id
  isAnswered.value = true
  if (id === currentCountry.value.id) {
    userStore.addBalance(50)
    sessionCredits.value += 50
  }
}

const getButtonClass = (id: string) => {
  if (!isAnswered.value) return 'hover:bg-white/10'
  if (!currentCountry.value) return ''
  if (id === currentCountry.value.id) return 'bg-green-500 text-black shadow-2xl scale-105 z-10'
  if (id === selectedId.value) return 'bg-red-500 text-black opacity-100'
  return 'opacity-10 scale-95'
}
</script>