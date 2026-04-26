<template>
  <div class="w-full h-full flex overflow-hidden bg-[var(--bg-main)] font-sans text-white">
    <aside class="w-80 border-r border-white/5 flex flex-col p-10 gap-10 bg-black/20">
      <header class="flex flex-col gap-2 text-white">
        <h1 class="text-4xl font-black uppercase italic tracking-tighter">{{ langStore.t.settings.title }}</h1>
        <span class="text-[10px] font-mono opacity-30 uppercase tracking-[0.4em] italic">{{ langStore.t.settings.subtitle }}</span>
      </header>

      <nav class="flex flex-col gap-2">
        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                class="w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all border-none cursor-pointer italic font-bold text-[11px] uppercase tracking-widest"
                :class="activeTab === tab.id ? 'bg-white text-black shadow-xl' : 'text-white/40 hover:bg-white/5 hover:text-white'">
          <span class="text-lg">{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </aside>

    <main class="flex-1 overflow-y-auto custom-scrollbar p-16">
      <div class="max-w-3xl flex flex-col gap-16">

        <section v-if="activeTab === 'general'" class="flex flex-col gap-12">
          <div class="flex flex-col gap-4">
            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-white/20 italic">Interface Protocol</h3>
            <div class="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex flex-col gap-8">
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-bold italic">{{ langStore.t.settings.localization }}</span>
                  <span class="text-[10px] opacity-30 font-medium italic">Primary system language</span>
                </div>
                <LangSwitcher />
              </div>
              <div class="h-[1px] bg-white/5"></div>
              <div class="flex items-center justify-between">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-bold italic">Map Navigation Tools</span>
                  <span class="text-[10px] opacity-30 font-medium italic">Show or hide the right tool panel</span>
                </div>
                <button @click="uiStore.showMapTools = !uiStore.showMapTools"
                        class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border-none cursor-pointer italic shadow-lg"
                        :class="uiStore.showMapTools ? 'bg-green-500 text-black' : 'bg-white/10 text-white/40'">
                  {{ uiStore.showMapTools ? 'Enabled' : 'Disabled' }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <h3 class="text-xs font-black uppercase tracking-[0.4em] text-white/20 italic">System Training</h3>
            <div class="p-8 rounded-[40px] bg-white/[0.02] border border-white/5 flex items-center justify-between">
              <div class="flex flex-col gap-1">
                <span class="text-sm font-bold italic text-amber-500 uppercase tracking-tighter">Initiate Course</span>
                <span class="text-[10px] opacity-30 font-medium italic">Interactive site walkthrough</span>
              </div>
              <button @click="uiStore.isHintsActive = true" class="px-8 py-3 rounded-xl bg-white text-black text-[10px] font-black uppercase border-none cursor-pointer hover:scale-105 transition-all italic">Start Tour</button>
            </div>
          </div>
        </section>

        <section v-else-if="activeTab === 'profile'" class="flex flex-col gap-8">
          <div class="w-full h-48 rounded-[48px] bg-white/5 border border-dashed border-white/10 flex items-center justify-center italic text-white/20 text-xs">Profile customization protocol coming soon...</div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const langStore = useLangStore(); const uiStore = useUiStore()
const activeTab = ref('general')
const tabs = computed(() => [
  { id: 'general', label: langStore.currentLang === 'ru' ? 'Общие' : 'General', icon: '⚙️' },
  { id: 'profile', label: langStore.currentLang === 'ru' ? 'Профиль' : 'Profile', icon: '👤' },
  { id: 'other', label: langStore.currentLang === 'ru' ? 'Другое' : 'Security', icon: '🔒' }
])
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
</style>