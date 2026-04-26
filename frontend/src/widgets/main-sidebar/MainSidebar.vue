<template>
  <Transition
      :enter-from-class="isMobile ? 'translate-y-full' : '-translate-x-full'"
      :leave-to-class="isMobile ? 'translate-y-full' : '-translate-x-full'"
      enter-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
      leave-active-class="transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
  >
    <aside
        v-if="ui.isSidebarOpen"
        :class="[
          'fixed z-50 flex flex-col shadow-2xl backdrop-blur-3xl border-[var(--sidebar-border)] bg-[var(--sidebar-bg)]/95',
          isMobile ? 'inset-x-0 bottom-0 h-[85vh] rounded-t-[40px] border-t' : 'left-0 top-0 bottom-0 w-80 rounded-r-[48px] border-r'
        ]"
    >
      <div class="flex flex-col h-full p-8 md:p-10 gap-8 overflow-y-auto custom-scrollbar">
        <!-- Полоска для мобилок -->
        <div v-if="isMobile" @click="ui.toggleSidebar"
             class="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-2 cursor-pointer"></div>

        <header class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <h1 class="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-white leading-none">
              Traveler</h1>
            <span class="text-[10px] font-black uppercase tracking-widest text-white/30 italic">{{
                langStore.t.navigation.atlas
              }}</span>
          </div>
          <button @click="ui.toggleSidebar"
                  class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border-none cursor-pointer">
            <span class="text-xs text-white/40">{{ isMobile ? '✕' : '◀' }}</span>
          </button>
        </header>

        <nav class="flex flex-col gap-2">
          <RouterLink
              v-for="item in menuItems"
              :key="item.id"
              :to="item.path"
              @click="isMobile ? ui.toggleSidebar() : null"
              class="group flex items-center gap-5 p-5 rounded-[24px] transition-all border border-transparent hover:bg-white/5"
              :class="route.name === item.id ? 'bg-white/5 border-white/10' : ''"
          >
            <span class="text-2xl group-hover:scale-110 transition-transform">{{ item.icon }}</span>
            <span class="text-[13px] font-black uppercase tracking-widest"
                  :style="{ color: route.name === item.id ? 'var(--ui-accent)' : 'var(--ui-text-muted)' }">
              {{ langStore.t.navigation[item.id] }}
            </span>
          </RouterLink>

          <button v-if="userStore.isAdmin" @click="ui.toggleAdminConsole"
                  class="flex items-center gap-5 p-5 rounded-[24px] border border-dashed border-white/10 bg-transparent cursor-pointer transition-all hover:border-[var(--ui-accent)]/50"
                  :class="{ 'bg-[var(--ui-accent)]/10 border-[var(--ui-accent)]/30': ui.isAdminConsoleOpen }">
            <span class="text-2xl opacity-40">⚙️</span>
            <span class="text-[13px] font-black uppercase tracking-widest"
                  :style="{ color: ui.isAdminConsoleOpen ? 'var(--ui-accent)' : 'var(--ui-text-muted)' }">{{
                langStore.t.navigation.console
              }}</span>
          </button>
        </nav>

        <div class="flex-1 min-h-[20px]"></div>

        <section class="flex flex-col gap-6">
          <StatsWidget v-if="isMobile"/>
          <div class="flex items-center gap-5 p-4 rounded-[32px] bg-white/5 border border-white/5">
            <div
                class="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-[var(--ui-accent)] text-black">
              {{ userStore.userName.charAt(0) }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-black text-white leading-none">{{ userStore.userName }}</span>
              <span class="text-[9px] uppercase font-mono mt-1 opacity-30 text-white">Registry Verified</span>
            </div>
          </div>
        </section>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import {useScreen} from '@shared/lib/useScreen'

const {isMobile} = useScreen();
const langStore = useLangStore();
const userStore = useUserStore();
const ui = useUiStore();
const route = useRoute()
const menuItems: { id: keyof typeof langStore.t.navigation, path: string, icon: string }[] = [{
  id: 'atlas',
  path: '/',
  icon: '🌍'
}, {id: 'shop', path: '/shop', icon: '💎'}, {id: 'options', path: '/settings', icon: '🔮'}]
</script>