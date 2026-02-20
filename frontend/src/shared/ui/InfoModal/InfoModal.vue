<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0 translate-y-4"
  >
    <div
        v-if="uiStore.isInfoModalOpen"
        class="fixed inset-0 z-[110] flex items-center justify-center p-12 backdrop-blur-sm"
        :style="{ backgroundColor: theme?.infoModal.overlay }"
        @click.self="close"
    >
      <div
          class="w-full max-w-2xl flex flex-col gap-10 p-12 rounded-[60px] border shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative overflow-hidden"
          :style="{
          backgroundColor: theme?.infoModal.bg,
          borderColor: theme?.infoModal.border
        }"
      >
        <!-- Шапка окна -->
        <div class="flex justify-between items-start w-full">
          <div class="flex flex-col gap-3">
            <span
                class="text-[10px] font-black uppercase tracking-[0.6em]"
                :style="{ color: theme?.infoModal.accent }"
            >
              {{ langStore.currentLang === 'ru' ? 'Информация о регионе' : 'Region Intelligence' }}
            </span>
            <h2 class="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">
              {{ countryName }}
            </h2>
          </div>

          <button
              @click="close"
              class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:bg-red-500 hover:text-white border-none outline-none cursor-pointer"
              :style="{
              backgroundColor: theme?.infoModal.closeBtnBg,
              color: '#ffffff'
            }"
          >
            ✕
          </button>
        </div>

        <!-- Контент (Пока пустой) -->
        <div class="flex flex-col gap-6 opacity-30 text-white italic">
          {{ langStore.currentLang === 'ru' ? 'Архив данных в разработке...' : 'Data archives under construction...' }}
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/uiStore'
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { ALL_COUNTRIES } from '@/countries'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{
  theme: MapTheme
}>()

const uiStore = useUiStore()
const mapStore = useMapStore()
const langStore = useLangStore()

const countryName = computed(() => {
  const id = mapStore.pendingCountryId
  const country = ALL_COUNTRIES.find(c => c.id === id)
  if (!country) return 'Unknown Sector'
  return langStore.currentLang === 'ru' ? country.nameRu : country.nameEn
})

const close = () => {
  uiStore.setInfoModal(false)
  mapStore.pendingCountryId = null
}
</script>