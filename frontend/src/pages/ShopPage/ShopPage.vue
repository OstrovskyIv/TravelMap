<template>
  <div
      class="w-full h-full p-12 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans transition-colors duration-1000 relative"
      :style="{ backgroundColor: store.currentTheme?.background }"
      @mousemove="handleMouseMove"
  >

    <!-- ФОНОВЫЙ ГРАДИЕНТ (НОЧНОЙ ГОРОД) -->
    <div class="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_30%,#3b82f6,transparent_70%)]"></div>

    <!-- ТАЛОН (БЕЗ ИЗМЕНЕНИЙ) -->
    <header class="flex justify-between items-center relative z-30">
      <div class="flex flex-col gap-2">
        <h1 class="text-7xl font-black uppercase tracking-tighter italic text-white leading-none">
          {{ langStore.currentLang === 'ru' ? 'Магазин' : 'Style Shop' }}
        </h1>
        <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40 text-white">Visual Engine Marketplace</span>
      </div>

      <!-- Твой билет-кошелек -->
      <div class="flex overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-all duration-500 hover:scale-[1.02] group shrink-0">
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

    <!-- ЦЕНТРАЛЬНАЯ ЗОНА: ДИЛЕР В ПОДВОРОТНЕ -->
    <div class="w-full flex flex-col items-center justify-center relative min-h-[450px] z-10">

      <!-- Облачко с фразами (Тёмное, в стиле дилера) -->
      <div class="absolute -top-6 bg-slate-900 border-2 border-blue-500/50 px-8 py-3 rounded-2xl shadow-[0_0_30px_rgba(59,130,246,0.2)] z-20">
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900 border-r-2 border-b-2 border-blue-500/50 rotate-45"></div>
        <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 scale-95" leave-active-class="transition-all duration-200" leave-to-class="opacity-0 scale-95">
          <span :key="currentPhraseIndex" class="text-[11px] font-black text-blue-400 uppercase tracking-widest text-center leading-none">
            {{ activePhrase }}
          </span>
        </Transition>
      </div>

      <!-- ПЕРСОНАЖ: ТЕНЕВЫЙ ТОРГОВЕЦ -->
      <div id="airport-agent" class="relative w-64 h-80 flex items-center justify-center pointer-events-none">
        <svg
            viewBox="0 0 100 120"
            class="w-full h-full drop-shadow-[0_25px_50px_rgba(0,0,0,0.8)] transition-transform duration-700"
            :style="{ transform: `rotate(${lookOffset.x * 0.3}deg)` }"
        >
          <!-- ПЛАЩ / ХУДИ (Тёмный дилер) -->
          <path d="M25 120 L32 70 Q50 55 68 70 L75 120 Z" fill="#0f172a" /> <!-- Тело -->
          <path d="M32 70 L15 100 M68 70 L85 100" stroke="#0f172a" stroke-width="10" stroke-linecap="round" /> <!-- Рукава -->

          <!-- Руки стикмана -->
          <path d="M15 100 L10 110 M85 100 L90 110" stroke="white" stroke-width="4" stroke-linecap="round" />

          <!-- Голова в тени капюшона -->
          <g :style="{ transform: `translate(${lookOffset.x * 0.5}px, ${lookOffset.y * 0.5}px)` }">
            <circle cx="50" cy="40" r="30" fill="#020617" /> <!-- Тень капюшона -->
            <circle cx="50" cy="42" r="26" fill="white" /> <!-- Лицо -->

            <!-- ШАПКА (Бини на макушке) -->
            <path d="M30 25 Q50 5 70 25 Z" fill="#1e293b" />
            <rect x="30" y="22" width="40" height="6" rx="2" fill="#0f172a" />

            <!-- ГЛАЗА -->
            <circle cx="40" cy="45" r="6.5" fill="#f8fafc" />
            <circle :cx="40 + lookOffset.x" :cy="45 + lookOffset.y" r="4" fill="#020617" />

            <circle cx="60" cy="45" r="6.5" fill="#f8fafc" />
            <circle :cx="60 + lookOffset.x" :cy="45 + lookOffset.y" r="4" fill="#020617" />

            <!-- Улыбка (хитрая) -->
            <path d="M44 60 Q50 64 56 60" stroke="#020617" stroke-width="2.5" fill="none" stroke-linecap="round" />
          </g>
        </svg>
      </div>

      <!-- СТОЙКА (Street Style) -->
      <div class="w-[600px] relative -mt-10">
        <div class="h-20 bg-[#020617] border-x-4 border-t-4 border-slate-900 rounded-t-3xl shadow-[0_20px_60px_rgba(0,0,0,1)] flex items-center px-12 gap-10">
          <!-- Неоновый индикатор -->
          <div class="w-32 h-6 bg-blue-500/5 border border-blue-500/20 rounded-md flex items-center justify-center gap-2">
            <span class="w-1 h-1 bg-blue-500 rounded-full animate-ping"></span>
            <span class="text-[7px] font-mono text-blue-500 uppercase tracking-widest">Encrypted Link</span>
          </div>

          <span class="flex-1 h-[1px] bg-slate-800"></span>

          <!-- Скрытый сканер -->
          <span class="w-24 h-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center gap-2 overflow-hidden shadow-inner">
             <span class="w-1 h-6 bg-blue-500/20 rounded-full relative overflow-hidden">
                <span class="absolute top-0 left-0 w-full h-1/2 bg-blue-500 animate-shimmer"></span>
             </span>
             <span class="text-[6px] font-black text-slate-600 uppercase">Verif-Eye</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Темы -->
    <section class="flex flex-col gap-8 relative z-20">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Твой инвентарь' : 'Your Inventory' }}
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
            <span v-if="store.currentTheme?.id === theme.id" class="px-4 py-1.5 rounded-full bg-blue-500 text-[9px] font-black uppercase tracking-widest text-white">Active</span>
          </span>
          <span class="flex flex-col gap-1">
            <span class="text-2xl font-black uppercase tracking-tight text-white">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-30 uppercase tracking-widest text-white">Status: Installed</span>
          </span>
        </button>
      </div>
    </section>

    <!-- Рынок -->
    <section v-if="availableThemes.length > 0" class="flex flex-col gap-8 relative z-20">
      <div class="flex items-center gap-4 px-4">
        <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">
          {{ langStore.currentLang === 'ru' ? 'Черный рынок' : 'Black Market' }}
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
            <span class="text-[10px] font-black text-red-500/50 uppercase tracking-widest italic leading-none">Restricted</span>
          </span>

          <span class="flex flex-col gap-1 relative z-10">
            <span class="text-2xl font-black uppercase tracking-tight text-white/40">{{ theme.name }}</span>
            <span class="text-[9px] font-mono opacity-10 uppercase tracking-widest text-white">Transfer miles to unlock data</span>
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
              Low Balance
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

// --- ВЗГЛЯД ---
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
  { ru: 'Псс... Есть кое-что эксклюзивное для твоего талона.', en: 'Psst... Got something exclusive for your pass.' },
  { ru: 'Мили на месте? Эти движки стоят каждого перелета.', en: 'Miles ready? These engines are worth every flight.' },
  { ru: 'Чистая работа. Никто не узнает, что ты сменил прошивку.', en: 'Clean job. No one will know you swapped the firmware.' },
  { ru: 'Выбирай быстрее, пока патруль не заметил сигнал.', en: 'Choose fast, before the patrol spots the signal.' }
]

const activePhrase = computed(() => {
  const list = phrases
  const index = currentPhraseIndex.value
  const item = list[index] || list[0]
  return langStore.currentLang === 'ru' ? item.ru : item.en
})

let timer: ReturnType<typeof setInterval>
onMounted(() => {
  timer = setInterval(() => {
    currentPhraseIndex.value = (currentPhraseIndex.value + 1) % phrases.length
  }, 7000)
})

onUnmounted(() => {
  clearInterval(timer)
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
@keyframes shimmer {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(200%); }
}
.animate-shimmer { animation: shimmer 2s infinite linear; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>