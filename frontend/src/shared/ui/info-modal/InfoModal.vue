<template>
  <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition-all duration-150 ease-in"
      leave-to-class="opacity-0 scale-95"
  >
    <div
        v-if="uiStore.isInfoModalOpen && countryData"
        class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        @click.self="close"
    >
      <div class="relative w-full max-w-2xl bg-[var(--modal-bg)] border border-[var(--ui-accent)]/20 rounded-[40px] shadow-2xl overflow-hidden">
        <div class="p-8 md:p-12 flex flex-col gap-8 text-white overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div class="flex justify-between items-start">
            <div class="flex flex-col gap-1">
              <span class="text-[9px] font-black uppercase text-[var(--ui-accent)] opacity-60 tracking-widest">{{ langStore.t.info.sector }}</span>
              <h2 class="text-5xl font-black uppercase italic tracking-tighter">{{ countryData.names[langStore.currentLang] }}</h2>
            </div>
            <button @click="close" class="w-10 h-10 rounded-xl bg-white/5 text-white/40 border-none cursor-pointer hover:bg-red-500/20 hover:text-red-500 transition-all">✕</button>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div v-for="(val, key) in countryData.stats" :key="key" class="p-4 rounded-3xl bg-white/5 border border-white/5">
              <span class="block text-[7px] uppercase opacity-30 mb-1">{{ key }}</span>
              <span class="text-xs font-bold">{{ val }}</span>
            </div>
          </div>

          <p class="text-base text-white/60 leading-relaxed italic border-l-2 border-[var(--ui-accent)]/20 pl-6">
            {{ countryData.description[langStore.currentLang] }}
          </p>

          <div class="flex flex-col gap-4">
            <div v-for="city in countryData.cities" :key="city.id" class="flex justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <span class="text-xs font-bold opacity-50 uppercase">{{ city.names[langStore.currentLang] }}</span>
              <span v-if="city.isCapital" class="text-[7px] font-black bg-[var(--ui-accent)] text-black px-2 py-0.5 rounded">CAPITAL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ALL_COUNTRIES } from '@entities/country/model'
const uiStore = useUiStore(); const mapStore = useMapStore(); const langStore = useLangStore()
const countryData = computed(() => ALL_COUNTRIES.find(c => c.id === mapStore.pendingCountryId) || null)
const close = () => uiStore.setInfoModal(false)
</script>