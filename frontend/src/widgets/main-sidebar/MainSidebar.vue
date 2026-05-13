<template>
  <Transition :enter-from-class="isMobile ? 'translate-y-full' : '-translate-x-full'" :leave-to-class="isMobile ? 'translate-y-full' : '-translate-x-full'" enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]" leave-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]">
    <aside v-if="ui.isSidebarOpen" :class="['fixed z-50 flex flex-col shadow-2xl backdrop-blur-3xl border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]/95', isMobile ? 'inset-x-0 bottom-0 h-[85vh] rounded-t-[40px] border-t' : 'left-0 top-0 bottom-0 w-80 rounded-r-[48px] border-r']">
      <div class="flex flex-col h-full p-8 md:p-10 gap-8 overflow-y-auto custom-scrollbar font-sans text-white">

        <header class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-3xl font-black tracking-tighter uppercase italic leading-none">Traveler</h1>
            <span class="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{{ langStore.t.navigation.atlas }}</span>
          </div>
          <button @click="ui.toggleSidebar" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border-none cursor-pointer text-white/40 hover:text-white transition-all">{{ isMobile ? '✕' : '◀' }}</button>
        </header>

        <nav class="flex flex-col gap-2">
          <RouterLink v-for="item in menuItems" :key="item.id" :to="item.path" class="group flex items-center gap-5 p-5 rounded-[24px] transition-all border border-transparent hover:bg-white/5" :class="route.name === item.id ? 'bg-white/5 border-white/10' : ''">
            <span class="text-2xl group-hover:scale-110 transition-transform">{{ item.icon }}</span>
            <span class="text-[13px] font-black uppercase tracking-widest" :style="{ color: route.name === item.id ? 'var(--ui-accent)' : 'var(--ui-text-muted)' }">{{ langStore.t.navigation[item.id] }}</span>
          </RouterLink>

          <div class="h-[1px] bg-white/5 my-2"></div>

          <!-- Кнопка Игры -->
          <button @click="ui.setGamesModal(true)" class="flex items-center gap-5 p-5 rounded-[24px] bg-transparent border-none cursor-pointer transition-all hover:bg-white/5 group">
            <span class="text-2xl group-hover:rotate-12 transition-transform">🎮</span>
            <span class="text-[13px] font-black uppercase tracking-widest text-[var(--ui-text-muted)] group-hover:text-white">{{ langStore.t.navigation.games }}</span>
          </button>

          <!-- Консоль админа (если админ) -->
          <button v-if="userStore.isAdmin" @click="ui.toggleAdminConsole" class="flex items-center gap-5 p-5 rounded-[24px] border border-dashed border-white/10 bg-transparent cursor-pointer transition-all hover:border-[var(--ui-accent)]/50 group" :class="{ 'bg-[var(--ui-accent)]/10 border-[var(--ui-accent)]/30': ui.isAdminConsoleOpen }">
            <span class="text-2xl opacity-40 group-hover:opacity-100 transition-opacity italic font-black">⚙️</span>
            <span class="text-[13px] font-black uppercase tracking-widest" :style="{ color: ui.isAdminConsoleOpen ? 'var(--ui-accent)' : 'var(--ui-text-muted)' }">{{ langStore.t.navigation.console }}</span>
          </button>
        </nav>

        <!-- VIP блок -->
        <div class="relative p-[1px] rounded-2xl overflow-hidden cursor-pointer active:scale-95 transition-all group" @click="ui.setVipModal(true)">
          <div class="absolute inset-0 vip-shimmer"></div>
          <div class="relative bg-black/90 rounded-[15px] px-5 py-3.5 flex items-center justify-between">
            <span class="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500 italic leading-none">VIP Protocol</span>
            <div v-if="userStore.isVip" class="text-xs">👑</div>
            <div v-else class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
          </div>
        </div>

        <div class="flex-1 min-h-[20px]"></div>

        <!-- СЕКЦИЯ ПРОФИЛЯ И ВЫХОДА -->
        <section class="flex flex-col gap-3">
          <!-- Ссылка на профиль -->
          <RouterLink to="/profile" class="flex items-center gap-5 p-4 rounded-[32px] bg-white/5 border border-white/5 shadow-inner hover:bg-white/[0.08] transition-all no-underline" :class="userStore.isVip ? 'border-yellow-500/30' : ''">
            <div class="relative shrink-0">
              <div class="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl drop-shadow-2xl z-10" v-if="userStore.activeHat">{{ userStore.activeHat }}</div>
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-[var(--ui-accent)] text-black relative z-0 uppercase" :class="userStore.isVip ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' : ''">
                {{ userStore.userName.charAt(0) }}
              </div>
            </div>
            <div class="flex flex-col gap-1 leading-none overflow-hidden">
              <span class="text-sm font-black italic text-white leading-none truncate">{{ userStore.userName }}</span>
              <span class="text-[8px] uppercase font-mono opacity-30 tracking-tighter text-white">View Profile</span>
            </div>
          </RouterLink>

          <!-- КНОПКА ВЫХОДА -->
          <button
              @click="handleLogout"
              class="flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/5 hover:bg-red-500/20 border border-red-500/10 hover:border-red-500/40 transition-all cursor-pointer group group"
          >
            <span class="text-lg opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all">⏻</span>
            <span class="text-[10px] font-black uppercase tracking-[0.2em] text-red-500/60 group-hover:text-red-500 italic">Terminate Session</span>
          </button>
        </section>

      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { useScreen } from '@shared/lib/useScreen'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/entities/user/model/userStore'
import { useUiStore } from '@shared/lib/uiStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'

const { isMobile } = useScreen()
const langStore = useLangStore()
const userStore = useUserStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const menuItems: { id: 'atlas' | 'shop' | 'options', path: string, icon: string }[] = [
  { id: 'atlas', path: '/', icon: '🌍' },
  { id: 'shop', path: '/shop', icon: '💎' },
  { id: 'options', path: '/settings', icon: '🔮' }
]

const handleLogout = () => {
  if (confirm('Вы уверены, что хотите прервать сессию?')) {
    userStore.logout()
    // Закрываем сайдбар, чтобы при следующем входе он не перекрывал экран
    ui.isSidebarOpen = false
    // Перенаправляем на главную (там сработает AuthModal)
    router.push('/')
  }
}
</script>

<style scoped>
.vip-shimmer { background: linear-gradient(115deg, transparent 0%, #facc15 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 3s linear infinite; }
@keyframes shimmer { 0% { background-position: 150% 0%; } 100% { background-position: -150% 0%; } }

/* Стили для скроллбара */
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>