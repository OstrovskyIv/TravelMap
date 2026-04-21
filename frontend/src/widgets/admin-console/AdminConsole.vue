<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 scale-95 translate-y-4"
  >
    <div
        v-if="uiStore.isAdminConsoleOpen"
        :class="[
          'fixed z-[100] flex flex-col overflow-hidden border shadow-[0_40px_100px_rgba(0,0,0,0.7)] backdrop-blur-3xl font-sans text-white bg-[var(--sidebar-bg)] transition-colors duration-500',
          isMobile ? 'inset-0 rounded-none' : 'rounded-2xl border-[var(--sidebar-border)]'
        ]"
        :style="!isMobile ? {
          width: size.w + 'px',
          height: size.h + 'px',
          left: position.x + 'px',
          top: position.y + 'px',
          willChange: 'left, top, width, height'
        } : {}"
    >
      <header
          @mousedown="!isMobile && startDragging($event)"
          class="h-11 flex items-center justify-between px-5 select-none shrink-0 bg-white/5 border-[var(--sidebar-border)]"
          :class="isMobile ? '' : 'cursor-grab active:cursor-grabbing'"
      >
        <span class="flex items-center gap-3 pointer-events-none">
          <span class="text-sm">🖥️</span>
          <span class="text-[10px] font-black uppercase tracking-widest text-[var(--ui-accent)] leading-none">
            Admin Terminal
          </span>
        </span>
        <button @click="uiStore.toggleAdminConsole" class="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-500 transition-all border-none bg-transparent cursor-pointer text-white">
          <span class="text-xs opacity-40">✕</span>
        </button>
      </header>

      <div class="flex-1 overflow-hidden flex">
        <aside :class="['border-r border-[var(--sidebar-border)] flex flex-col shrink-0', isMobile ? 'w-20' : 'w-64']">
          <nav class="w-full flex-1 overflow-y-auto custom-scrollbar py-3 px-2 flex flex-col gap-1">
            <button v-for="item in navItems" :key="item.id" @click="activeSection = item.id"
                    class="w-full flex items-center justify-center md:justify-start gap-3 px-4 py-3 rounded-xl transition-all border border-transparent bg-transparent cursor-pointer"
                    :style="{
                  backgroundColor: activeSection === item.id ? 'var(--ui-active-bg)' : 'transparent',
                  color: activeSection === item.id ? 'var(--ui-accent)' : 'var(--ui-text-muted)'
                }"
            >
              <span class="text-base">{{ item.icon }}</span>
              <span v-if="!isMobile" class="text-[11px] font-black uppercase tracking-wider">{{ langStore.t.admin[item.id] }}</span>
            </button>
          </nav>
        </aside>

        <main class="flex-1 overflow-y-auto bg-black/10 custom-scrollbar">
          <Transition mode="out-in" enter-active-class="transition-all duration-200" enter-from-class="opacity-0">
            <EconomyTab v-if="activeSection === 'economics'" />
            <ThemesTab v-else-if="activeSection === 'themes'" />
            <div v-else class="w-full h-full flex items-center justify-center opacity-20 italic text-xs font-mono text-white">Module encrypted...</div>
          </Transition>
        </main>

        <div v-if="!isMobile" @mousedown="startResizing" class="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 group">
          <svg viewBox="0 0 16 16" class="w-full h-full"><path d="M16 0 L16 16 L0 16 Z" fill="var(--ui-accent)" class="opacity-10 group-hover:opacity-40 transition-opacity"/></svg>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import EconomyTab from './ui/EconomyTab.vue'
import ThemesTab from './ui/ThemesTab.vue'
import { useDraggable } from '@shared/lib/useDraggable'
import { useScreen } from '@shared/lib/useScreen'

const uiStore = useUiStore(); const langStore = useLangStore(); const { isMobile } = useScreen()
const { position, size, startDragging, startResizing } = useDraggable({ initialWidth: 900, initialHeight: 600, minWidth: 750, minHeight: 500 })
const activeSection = ref<keyof typeof langStore.t.admin>('economics')
const navItems: { id: keyof typeof langStore.t.admin, icon: string }[] = [{ id: 'economics', icon: '💰' }, { id: 'themes', icon: '🎨' }, { id: 'general', icon: '⚙️' }, { id: 'users', icon: '👥' }]
</script>