<template>
  <div
      class="w-full h-full p-12 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans transition-colors duration-1000 relative"
      :style="{ backgroundColor: store.currentTheme?.background }"
      @mousemove="handleMouseMove"
  >

    <!-- ТАЛОН (ХЕДЕР) -->
    <header class="flex justify-between items-center relative z-30">
      <div class="flex flex-col gap-2">
        <h1 class="text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
          {{ langStore.currentLang === 'ru' ? 'Магазин' : 'Style Shop' }}
        </h1>
        <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40 text-white">Visual Engine Marketplace</span>
      </div>

      <!-- Твой любимый билет -->
      <div class="flex overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02] group shrink-0">
        <div class="bg-blue-600 px-3 py-6 flex items-center justify-center border-r border-white/10 shrink-0">
          <span class="[writing-mode:vertical-lr] rotate-180 text-[7px] font-black uppercase tracking-[0.4em] text-white/70">Boarding Pass</span>
        </div>
        <div class="bg-white px-10 py-6 flex flex-col items-center justify-center gap-1 min-w-[160px]">
          <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none">Wallet Balance</span>
          <div class="flex items-baseline gap-1">
            <span class="text-5xl font-black text-slate-900 leading-none tracking-tighter">{{ userStore.balance }}</span>
            <span class="text-[10px] font-black text-blue-500 uppercase italic">Miles</span>
          </div>
          <span class="text-[7px] font-bold text-slate-300 uppercase tracking-widest mt-1">Verified Registry</span>
        </div>
        <div class="relative w-[2px] bg-white flex flex-col justify-center">
          <div class="absolute -top-2 -left-[7px] w-4 h-4 bg-black/40 rounded-full"></div>
          <div class="h-full border-l-2 border-dashed border-slate-200 mx-auto"></div>
          <div class="absolute -bottom-2 -left-[7px] w-4 h-4 bg-black/40 rounded-full"></div>
        </div>
        <div class="bg-white px-8 py-6 flex flex-col justify-between items-end gap-3 shrink-0">
          <div class="flex flex-col items-end gap-0.5">
            <span class="text-[7px] font-black text-slate-300 uppercase leading-none">Flight</span>
            <span class="text-xs font-black text-slate-800 leading-none tracking-tighter">TM-{{ currentYear }}</span>
          </div>
          <div class="flex flex-col items-end gap-0.5">
            <span class="text-[7px] font-black text-slate-300 uppercase leading-none">Date</span>
            <span class="text-xs font-black text-slate-800 leading-none tracking-tighter">{{ formattedDate }}</span>
          </div>
          <div class="flex flex-col items-end gap-0.5">
            <span class="text-[7px] font-black text-slate-300 uppercase leading-none">Class</span>
            <span class="text-[8px] font-black text-blue-600 uppercase px-2 py-0.5 bg-blue-50 rounded-md tracking-tighter">Priority</span>
          </div>
        </div>
      </div>
    </header>

    <!-- ЦЕНТРАЛЬНАЯ ЗОНА: УЛУЧШЕННЫЙ ПЕРСОНАЖ -->
    <div class="w-full flex flex-col items-center justify-center relative min-h-[400px] z-10">

      <!-- Облачко (Speech Bubble) -->
      <div class="absolute -top-6 bg-white border-2 border-slate-900 px-8 py-3 rounded-2xl shadow-2xl z-20">
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r-2 border-b-2 border-slate-900 rotate-45"></div>
        <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-90" leave-active-class="transition-all duration-200" leave-to-class="opacity-0 scale-90">
          <p :key="currentPhraseIndex" class="text-[11px] font-black text-slate-900 uppercase tracking-widest text-center leading-none">
            {{ activePhrase }}
          </p>
        </Transition>
      </div>

      <!-- СТИКМАН (ЖИВОЙ) -->
      <div id="airport-agent" class="relative w-64 h-72 flex items-center justify-center pointer-events-none">
        <svg
            viewBox="0 0 100 120"
            class="w-full h-full drop-shadow-[0_10px_20px_rgba(0,0,0,0.4)] transition-transform duration-500"
            :style="{ transform: `rotate(${lookOffset.x * 0.5}deg)` }"
        >
          <!-- Тело (Плавные линии) -->
          <g stroke="white" stroke-width="5" stroke-linecap="round" fill="none">
            <path d="M50 65 L50 110" /> <!-- Торс -->
            <path d="M50 75 L25 105" /> <!-- Левая рука -->
            <path d="M50 75 L75 105" /> <!-- Правая рука -->
          </g>

          <!-- Голова -->
          <g :style="{ transform: `translate(${lookOffset.x * 0.5}px, ${lookOffset.y * 0.5}px)` }">
            <circle cx="50" cy="40" r="26" fill="white" />

            <!-- Брови (Добавляют эмоцию) -->
            <path
                :d="`M35 ${32 + lookOffset.y * 0.2} Q40 ${30 + lookOffset.y * 0.2} 45 ${32 + lookOffset.y * 0.2}`"
                stroke="#1e293b" stroke-width="1.5" fill="none"
            />
            <path
                :d="`M55 ${32 + lookOffset.y * 0.2} Q60 ${30 + lookOffset.y * 0.2} 65 ${32 + lookOffset.y * 0.2}`"
                stroke="#1e293b" stroke-width="1.5" fill="none"
            />

            <!-- Глаза -->
            <circle cx="38" cy="42" r="6" fill="#f8fafc" />
            <circle :cx="38 + lookOffset.x" :cy="42 + lookOffset.y" r="3.5" fill="#1e293b" />

            <circle cx="62" cy="42" r="6" fill="#f8fafc" />
            <circle :cx="62 + lookOffset.x" :cy="42 + lookOffset.y" r="3.5" fill="#1e293b" />

            <!-- Добрая улыбка -->
            <path d="M42 56 Q50 62 58 56" stroke="#1e293b" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
        </svg>
      </div>

      <!-- СТОЙКА -->
      <div class="w-[600px] relative -mt-8">
        <div class="h-36 w-full bg-white/[0.03] backdrop-blur-md border-x border-t border-white/10 rounded-t-[50px] absolute -top-28 left-0 -z-10"></div>
        <div class="h-16 bg-slate-900 border-x-4 border-t-4 border-slate-800 rounded-t-2xl shadow-2xl flex items-center px-10 gap-8">
          <span class="w-32 h-7 bg-blue-500/5 border border-blue-500/20 rounded flex items-center px-3 gap-2">
            <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
            <span class="text-[6px] font-mono text-blue-400 uppercase tracking-widest">Active Registry</span>
          </span>
          <span class="flex-1 h-[1px] bg-slate-800"></span>
          <span class="w-20 h-10 bg-slate-800 border border-slate-700 rounded-lg flex flex-col items-center justify-center gap-1 shadow-inner">
             <span class="w-12 h-0.5 bg-blue-500 shadow-[0_0_5px_#3b82f6]"></span>
             <span class="text-[5px] font-black text-slate-500 uppercase">Scanner</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Темы (Ваш авиапарк) -->
    <section class="flex flex-col gap-8 relative z-20">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Ваш авиапарк' : 'Your Hangar' }}
        </h2>
        <div class="h-[1px] flex-1 bg-white/5"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button
            v-for="theme in ownedThemes" :key="theme.id"
            @click="store.setTheme(theme.id)"
            class="p-10 rounded-[48px] border transition-all duration-500 flex flex-col gap-8 group hover:scale-[1.02] text-left outline-none relative overflow-hidden"
            :style="{
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderColor: store.currentTheme?.id === theme.id ? theme.colors.ui.accent : 'rgba(255,255,255,0.1)'
          }"
        >
          <span class="flex justify-between items-center w-full">
            <span class="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl bg-white/5 border border-white/5 shadow-2xl">
              {{ theme.id === 'wooden' ? '🪵' : '✨' }}
            </span>
            <span v-if="store.currentTheme?.id === theme.id" class="px-4 py-1.5 rounded-full bg-blue-500 text-[9px] font-black uppercase tracking-widest text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              Equipped
            </span>
          </span>
          <span class="flex flex-col gap-1">
            <span class="text-2xl font-black uppercase tracking-tight text-white">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-30 uppercase tracking-widest text-white">License: Granted</span>
          </span>
        </button>
      </div>
    </section>

    <!-- Рынок -->
    <section v-if="availableThemes.length > 0" class="flex flex-col gap-8 relative z-20">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Касса бронирования' : 'Booking Terminal' }}
        </h2>
        <div class="h-[1px] flex-1 bg-white/5"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
            v-for="theme in availableThemes" :key="theme.id"
            class="p-10 rounded-[48px] border border-white/5 bg-black/20 flex flex-col gap-8 relative overflow-hidden group shadow-xl"
        >
          <span class="flex justify-between items-center w-full relative z-10">
            <span class="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl bg-white/[0.02] border border-white/5 grayscale">
               {{ theme.id === 'wooden' ? '🪵' : '✨' }}
            </span>
            <span class="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Restricted</span>
          </span>

          <span class="flex flex-col gap-1 relative z-10">
            <span class="text-2xl font-black uppercase tracking-tight text-white/40">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-10 uppercase tracking-widest text-white">Exchange miles to unlock</span>
          </span>

          <button
              @click="userStore.buyTheme(theme.id, theme.price || 0)"
              :disabled="userStore.balance < (theme.price || 0)"
              class="w-full py-5 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 border shadow-2xl relative z-10 outline-none cursor-pointer"
              :class="userStore.balance >= (theme.price || 0)
                ? 'bg-white text-black border-transparent hover:bg-blue-500 hover:text-white'
                : 'bg-red-500/5 border-red-500/20 text-red-500/40 cursor-not-allowed'"
          >
            <span class="text-xs font-black uppercase tracking-widest">
              {{ theme.price || 0 }} 🎫
            </span>
            <span v-if="userStore.balance < (theme.price || 0)" class="text-[8px] font-bold opacity-60">
              Need funds
            </span>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted
} from 'vue'
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { useUserStore } from '@/stores/userStore'

const store = useMapStore()
const langStore = useLangStore()
const userStore = useUserStore()

// --- ЛОГИКА ВЗГЛЯДА (УЛУЧШЕННАЯ) ---
const lookOffset = ref({ x: 0, y: 0 })
const handleMouseMove = (e: MouseEvent) => {
  const agentEl = document.getElementById('airport-agent')
  if (!agentEl) return

  const rect = agentEl.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  const deltaX = e.clientX - centerX
  const deltaY = e.clientY - centerY

  const sensitivity = 600
  const maxMove = 5

  let moveX = (deltaX / sensitivity) * maxMove
  let moveY = (deltaY / sensitivity) * maxMove

  const dist = Math.sqrt(moveX * moveX + moveY * moveY)
  if (dist > maxMove) {
    const r = maxMove / dist
    moveX *= r
    moveY *= r
  }
  lookOffset.value = { x: moveX, y: moveY }
}

// --- ФРАЗЫ ---
const currentPhraseIndex = ref(0)
const phrases = [
  { ru: 'Добрый день! Ваш билет, пожалуйста.', en: 'Good day! Your ticket, please.' },
  { ru: 'Сверяю количество накопленных миль...', en: 'Checking your accumulated miles...' },
  { ru: 'Все системы в норме. Куда летим?', en: 'All systems are normal. Where to?' },
  { ru: 'У вас отличный выбор визуальных систем!', en: 'You have a great choice of visual systems!' }
]

const activePhrase = computed(() => {
  const list = phrases
  const index = currentPhraseIndex.value
  const item = list[index] || list[0]
  return langStore.currentLang === 'ru' ? item.ru : item.en
})

let phraseTimer: ReturnType<typeof setInterval>
onMounted(() => {
  phraseTimer = setInterval(() => {
    currentPhraseIndex.value = (currentPhraseIndex.value + 1) % phrases.length
  }, 6000)
})
onUnmounted(() => {
  clearInterval(phraseTimer)
})

// --- ДАТА ---
const formattedDate = computed(() => {
  const date = new Date()
  return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`
})
const currentYear = computed(() => new Date().getFullYear())

// --- ТЕМЫ ---
const themesList = computed(() => Object.values(store.themes))
const ownedThemes = computed(() => themesList.value.filter((t) => userStore.purchasedThemes.includes(t.id)))
const availableThemes = computed(() => themesList.value.filter((t) => !userStore.purchasedThemes.includes(t.id)))
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }

/* Анимация легкого дыхания */
#airport-agent svg {
  animation: breathe 4s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2px) scale(1.01); }
}
</style>