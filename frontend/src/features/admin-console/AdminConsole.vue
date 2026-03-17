<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <!-- Корпус окна -->
    <div
        v-if="uiStore.isAdminConsoleOpen"
        class="fixed z-[100] flex flex-col overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl transition-colors duration-500 rounded-2xl font-sans text-white"
        :style="{
        width: size.w + 'px',
        height: size.h + 'px',
        left: position.x + 'px',
        top: position.y + 'px',
        backgroundColor: store.currentTheme?.sidebar.bg + 'F2',
        borderColor: store.currentTheme?.sidebar.border
      }"
    >
      <!-- Верхняя панель -->
      <header
          @mousedown="startDragging"
          class="h-11 flex items-center justify-between px-5 cursor-grab active:cursor-grabbing border-b select-none transition-colors shrink-0"
          :style="{ backgroundColor: store.currentTheme?.sidebar.activeBg, borderColor: store.currentTheme?.sidebar.border }"
      >
        <span class="flex items-center gap-3 pointer-events-none text-white font-sans">
          <span class="text-sm">🖥️</span>
          <span class="flex flex-col text-white">
            <span class="text-[10px] font-black uppercase tracking-widest leading-none" :style="{ color: store.currentTheme?.sidebar.accent }">
              Admin Terminal "Test.v.1.0"
            </span>
          </span>
        </span>

        <button @click="uiStore.toggleAdminConsole" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 transition-all active:scale-90 group border-none outline-none bg-transparent cursor-pointer text-white font-bold">
          <span class="text-xs opacity-40 group-hover:opacity-100">✕</span>
        </button>
      </header>

      <div class="flex-1 overflow-hidden relative flex">
        <!-- Лево - Навигация -->
        <aside class="w-64 border-r overflow-hidden flex flex-col items-center shrink-0" :style="{ borderColor: store.currentTheme?.sidebar.border }">
          <div class="w-full px-5 py-4 border-b flex justify-center items-center text-center" :style="{ borderColor: store.currentTheme?.sidebar.border }">
            <h3 class="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 text-white" :style="{ color: store.currentTheme?.sidebar.text }">
              {{ langStore.currentLang === 'ru' ? 'Панель управления' : 'Control Panel' }}
            </h3>
          </div>
          <div class="w-full flex-1 overflow-y-auto custom-scrollbar py-3 px-3">
            <nav class="flex flex-col gap-1">
              <button
                  v-for="item in navItems" :key="item.id"
                  @click="activeSection = item.id"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:scale-[1.02] border border-transparent text-left outline-none bg-transparent cursor-pointer text-white"
                  :style="{
                  backgroundColor: activeSection === item.id ? store.currentTheme?.sidebar.activeBg : 'transparent',
                  color: activeSection === item.id ? store.currentTheme?.sidebar.accent : store.currentTheme?.sidebar.text
                }"
              >
                <span class="text-base text-white">{{ item.icon }}</span>
                <span class="text-[11px] font-black uppercase tracking-wider text-white">{{ langStore.currentLang === 'ru' ? item.nameRu : item.nameEn }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- Право --- Контент -->
        <main class="flex-1 overflow-hidden relative flex flex-col bg-black/10">
          <Transition mode="out-in" enter-active-class="transition-all duration-300" enter-from-class="opacity-0 translate-y-2">

            <!-- Экран загрузки -->
            <div v-if="!activeSection" class="w-full h-full flex flex-col items-center justify-center gap-6">
              <div
                  class="w-10 h-10 border-2 border-white/5 border-t-white/60 rounded-full animate-spin"
                  :style="{ borderTopColor: store.currentTheme?.colors.map.visited[0] }"
              ></div>

              <div class="flex flex-col items-center gap-2 opacity-40 text-center px-10 text-white font-sans">
                <span class="text-[10px] font-black uppercase tracking-[0.3em]">
                  {{ langStore.currentLang === 'ru' ? 'Система в режиме ожидания' : 'System Standby' }}
                </span>

                <span class="text-[9px] font-mono italic text-white text-center leading-relaxed max-w-[200px]">
                  {{ langStore.currentLang === 'ru'
                    ? 'Пожалуйста, выберите модуль на панели управления для начала работы'
                    : 'Please select a module from the control panel to begin'
                  }}
                </span>
              </div>
            </div>

            <!-- Экономика -->
            <div v-else-if="activeSection === 'currency'" class="w-full h-full p-8 lg:p-12 flex flex-col gap-10 overflow-y-auto custom-scrollbar text-white">

              <div class="w-full flex flex-col shadow-[0_30px_70px_rgba(0,0,0,0.6)] rounded-[32px] overflow-hidden transition-transform duration-500 hover:scale-[1.01] shrink-0">

                <div class="bg-blue-600 px-8 py-4 flex justify-between items-center border-b border-white/10">
                  <div class="flex flex-col gap-0.5">
                    <span class="text-[9px] font-black uppercase tracking-[0.4em] text-white/70 leading-none">
                      {{ langStore.currentLang === 'ru' ? 'Реестр управления полетами' : 'Aviation Control Registry' }}
                    </span>
                    <span class="text-xs font-bold text-white leading-none">
                      {{ langStore.currentLang === 'ru' ? 'Внутренний терминал системы v.1.0' : 'Internal System Terminal v.1.0' }}
                    </span>
                  </div>
                  <div class="px-3 py-1 rounded bg-black/20 border border-white/10">
                    <span class="text-[9px] font-black text-white uppercase tracking-widest">
                      {{ langStore.currentLang === 'ru' ? 'Админ-доступ' : 'Admin Access' }}
                    </span>
                  </div>
                </div>

                <div class="bg-white flex relative">
                  <div class="bg-slate-50 px-3 py-6 flex items-center justify-center border-r border-slate-100">
                    <span class="[writing-mode:vertical-lr] rotate-180 text-[7px] font-black uppercase tracking-[0.5em] text-slate-300">
                      {{ langStore.currentLang === 'ru' ? 'Служебный пропуск' : 'Authority Pass' }}
                    </span>
                  </div>

                  <div class="flex-1 p-8 flex justify-between items-center">
                    <div class="flex flex-col gap-6 text-slate-900">
                      <div class="flex flex-col">
                        <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.3em] leading-none">
                          {{ langStore.currentLang === 'ru' ? 'Общий реестр миль' : 'Total Miles Registry' }}
                        </span>
                        <div class="flex items-baseline gap-2">
                          <span class="text-7xl font-black text-slate-900 leading-none tracking-tighter">{{ userStore.balance }}</span>
                          <span class="text-xl font-black text-blue-600 uppercase italic">
                             {{ langStore.currentLang === 'ru' ? 'Миль' : 'Miles' }}
                          </span>
                        </div>
                      </div>

                      <div class="flex flex-col gap-1.5 opacity-90">
                        <div class="h-10 w-56 bg-[repeating-linear-gradient(90deg,#111827,#111827_2px,#fff_2px,#fff_4px)]"></div>
                        <div class="flex justify-between w-56 px-1">
                          <span class="text-[7px] font-mono text-slate-400 uppercase">ID: {{ userStore.userName }}</span>
                          <span class="text-[7px] font-mono text-slate-400 uppercase italic">AUTH: 009-X</span>
                        </div>
                      </div>
                    </div>

                    <div class="absolute right-[28%] top-0 bottom-0 flex flex-col justify-center">
                      <div class="absolute -top-3 -left-[9px] w-5 h-5 bg-black/10 rounded-full"></div>
                      <div class="h-full border-l-2 border-dashed border-slate-200 mx-auto"></div>
                      <div class="absolute -bottom-3 -left-[9px] w-5 h-5 bg-black/10 rounded-full"></div>
                    </div>

                    <div class="flex flex-col items-center gap-6 pl-12 pr-4 text-slate-900">
                      <div class="flex flex-col items-center gap-1">
                        <span class="text-[8px] font-black text-slate-300 uppercase">
                          {{ langStore.currentLang === 'ru' ? 'Статус' : 'Status' }}
                        </span>
                        <div class="w-12 h-12 rounded-full border-4 border-blue-500 flex items-center justify-center">
                          <span class="text-[10px] font-black text-blue-600">VIP</span>
                        </div>
                      </div>
                      <div class="flex flex-col items-center gap-1">
                        <span class="text-[8px] font-black text-slate-300 uppercase">
                          {{ langStore.currentLang === 'ru' ? 'Терминал' : 'Terminal' }}
                        </span>
                        <span class="text-xl font-black text-slate-800 tracking-tighter uppercase">CMD-1</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                    @click="userStore.balance = 0"
                    class="bg-slate-50 py-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border-t border-slate-100 outline-none border-none cursor-pointer"
                >
                  {{ langStore.currentLang === 'ru' ? 'Аннулировать и очистить полетные мили' : 'Terminate and Wipe Flight Credits' }}
                </button>
              </div>

              <div class="flex flex-col gap-6 w-full text-white">
                <div class="p-8 bg-white/5 border border-white/10 rounded-[36px] flex flex-col gap-6 shadow-xl">
                  <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 leading-none">
                    {{ langStore.currentLang === 'ru' ? 'Быстрая инъекция активов' : 'Quick Asset Injection' }}
                  </span>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button @click="userStore.addBalance(100)" class="py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase hover:bg-blue-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">+100</button>
                    <button @click="userStore.addBalance(500)" class="py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-black text-xs uppercase hover:bg-blue-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">+500</button>
                    <button @click="userStore.addBalance(-100)" class="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase hover:bg-red-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">-100</button>
                    <button @click="userStore.addBalance(-500)" class="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase hover:bg-red-500/20 transition-all active:scale-95 border-none outline-none cursor-pointer">-500</button>
                  </div>
                </div>

                <div class="p-8 bg-white/5 border border-white/10 rounded-[36px] flex flex-col gap-5 shadow-xl">
                  <span class="text-[9px] font-black uppercase tracking-[0.3em] opacity-30 font-sans leading-none">
                    {{ langStore.currentLang === 'ru' ? 'Ручная перезапись реестра' : 'Manual Registry Overwrite' }}
                  </span>
                  <div class="flex flex-col gap-3">
                    <input
                        v-model="customBalance"
                        type="number"
                        min="0"
                        class="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-sm font-bold outline-none focus:border-blue-500 transition-all text-white placeholder:opacity-30"
                        :placeholder="langStore.currentLang === 'ru' ? 'Установить точный баланс...' : 'Set exact balance...'"
                    />
                    <button
                        @click="setExactBalance"
                        class="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase hover:bg-blue-500 active:scale-95 transition-all shadow-lg border-none outline-none cursor-pointer"
                    >
                      {{ langStore.currentLang === 'ru' ? 'Синхронизировать базу данных' : 'Synchronize Database' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Общие настройки -->
            <div v-else-if="activeSection === 'general'" class="w-full h-full p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              <h3 class="text-2xl font-black uppercase tracking-tighter italic text-white">
                {{ langStore.currentLang === 'ru' ? 'Общие настройки' : 'General Settings' }}
              </h3>

              <div class="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col gap-6 text-white shadow-xl">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                  {{ langStore.currentLang === 'ru' ? 'Язык системы' : 'System Language' }}
                </span>
                <LangSwitcher :theme="store.currentTheme" />
              </div>

              <div class="p-8 bg-white/5 border border-white/10 rounded-[40px] flex flex-col gap-6 text-white shadow-xl">
                <span class="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">
                  {{ langStore.currentLang === 'ru' ? 'Параметры журнала' : 'Travel Log Options' }}
                </span>

                <button
                    @click="store.resetVisited()"
                    class="w-full py-4 rounded-2xl bg-red-600/10 border border-red-400 text-red-400 font-bold text-xs uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all outline-none border-none cursor-pointer"
                >
                  {{ langStore.currentLang === 'ru' ? 'Сбросить историю путешествий' : 'Reset Travel History' }}
                </button>

                <p class="text-[9px] font-medium opacity-20 uppercase tracking-widest text-center">
                  {{ langStore.currentLang === 'ru' ? 'Внимание: действие необратимо' : 'Warning: this action is irreversible' }}
                </p>
              </div>
            </div>

            <!-- Темы -->
            <div v-else-if="activeSection === 'theme'" class="w-full h-full p-8 lg:p-12 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              <h3 class="text-3xl font-black uppercase tracking-tighter italic text-white leading-none">Theme Access Management</h3>
              <div class="flex flex-col gap-4">
                <div v-for="t in Object.values(store.themes)" :key="t.id" class="p-6 bg-white/5 border border-white/10 rounded-[40px] flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all group overflow-hidden">
                  <div class="flex items-center gap-6 min-w-0 flex-1">
                    <span class="w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center text-3xl shadow-inner shrink-0 text-white">{{ t.id === 'wooden' ? '🪵' : '✨' }}</span>

                    <div class="flex flex-col gap-1 min-w-0">
                      <div class="flex items-center gap-2.5">
                        <div
                            class="w-2 h-2 rounded-full shrink-0 shadow-lg transition-all duration-500"
                            :class="userStore.purchasedThemes.includes(t.id) ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'"
                        ></div>
                        <span class="text-[15px] font-black uppercase tracking-tight text-white whitespace-nowrap overflow-hidden text-ellipsis">{{ t.name }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    <button v-if="userStore.purchasedThemes.includes(t.id) && t.id !== 'classic'" @click="userStore.lockTheme(t.id)" class="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase whitespace-nowrap border-none outline-none cursor-pointer">Lock</button>
                    <button v-if="!userStore.purchasedThemes.includes(t.id)" @click="userStore.unlockTheme(t.id)" class="px-4 py-2.5 rounded-xl bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white transition-all text-[9px] font-black uppercase whitespace-nowrap border-none outline-none cursor-pointer">Grant</button>
                    <button @click="store.setTheme(t.id)" class="px-4 py-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all text-[9px] font-black uppercase outline-none border-none cursor-pointer">Equip</button>
                  </div>

                </div>
              </div>
            </div>

          </Transition>
        </main>

        <!-- Уголок ресайза -->
        <div @mousedown="startResizing" class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group pointer-events-auto text-white">
          <svg viewBox="0 0 16 16" class="w-full h-full transition-all duration-300 overflow-visible">
            <path d="M16 0 L16 16 L0 16 Z" class="transition-all duration-300" :style="{fill: store.currentTheme?.sidebar.accent, opacity: isResizing ? '0.4' : '0.1'}"/>
            <path d="M0 16 L16 0" class="transition-opacity duration-300 opacity-20 group-hover:opacity-60" :style="{ stroke: store.currentTheme?.sidebar.accent }" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useMapStore } from '@entities/map/model/mapStore'
import { useUiStore } from '@shared/lib/uiStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'
import { useUserStore } from '@entities/user/model/userStore'
import { LangSwitcher } from '@features/lang-switcher'

const store = useMapStore()
const uiStore = useUiStore()
const langStore = useLangStore()
const userStore = useUserStore()

const customBalance = ref<number | null>(null)
const setExactBalance = () => {
  if (customBalance.value !== null) {
    userStore.balance = customBalance.value < 0 ? 0 : customBalance.value
    customBalance.value = null
  }
}

const navItems = [
  { id: 'general', nameRu: 'Общие настройки', nameEn: 'General Settings', icon: '⚙️' },
  { id: 'currency', nameRu: 'Экономика', nameEn: 'Economics', icon: '💰' },
  { id: 'theme', nameRu: 'Управление темами', nameEn: 'Theme Access', icon: '🎨' },
  { id: 'users', nameRu: 'Пользователи', nameEn: 'Users', icon: '👥' },
  { id: 'backup', nameRu: 'Резерв', nameEn: 'Backup', icon: '💾' },
]

const activeSection = ref<string | null>(null)
const position = ref({ x: 0, y: 0 })
const size = ref({ w: 900, h: 600 })

const dragOffset = { x: 0, y: 0 }
let isDragging = false

const startDragging = (e: MouseEvent) => {
  isDragging = true
  dragOffset.x = e.clientX - position.value.x
  dragOffset.y = e.clientY - position.value.y
  window.addEventListener('mousemove', handleDragging)
  window.addEventListener('mouseup', stopDragging)
}

const handleDragging = (e: MouseEvent) => {
  if (!isDragging) return
  position.value.x = e.clientX - dragOffset.x
  position.value.y = e.clientY - dragOffset.y
}

const stopDragging = () => {
  isDragging = false
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
}

const isResizing = ref(false)
const initialMousePos = { x: 0, y: 0 }
const initialSize = { w: 0, h: 0 }

const startResizing = (e: MouseEvent) => {
  e.stopPropagation()
  isResizing.value = true
  initialMousePos.x = e.clientX
  initialMousePos.y = e.clientY
  initialSize.w = size.value.w
  initialSize.h = size.value.h
  window.addEventListener('mousemove', handleResizing)
  window.addEventListener('mouseup', stopResizing)
}

const handleResizing = (e: MouseEvent) => {
  if (!isResizing.value) return
  const deltaX = e.clientX - initialMousePos.x
  const deltaY = e.clientY - initialMousePos.y
  size.value.w = Math.max(650, initialSize.w + deltaX)
  size.value.h = Math.max(450, initialSize.h + deltaY)
}

const stopResizing = () => {
  isResizing.value = false
  window.removeEventListener('mousemove', handleResizing)
  window.removeEventListener('mouseup', stopResizing)
}

onMounted(() => {
  position.value.x = (window.innerWidth - size.value.w) / 2
  position.value.y = (window.innerHeight - size.value.h) / 2
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleDragging)
  window.removeEventListener('mouseup', stopDragging)
  window.removeEventListener('mousemove', handleResizing)
  window.removeEventListener('mouseup', stopResizing)
})
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.custom-scrollbar::-webkit-scrollbar { width: 4px; height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(155, 155, 155, 0.2); border-radius: 10px; }
</style>