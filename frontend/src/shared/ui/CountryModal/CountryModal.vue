<template>
  <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-to-class="opacity-0"
  >
    <div
        v-if="uiStore.isCountryModalOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-8 backdrop-blur-md"
        :style="{ backgroundColor: theme?.countryModal.overlay }"
        @click.self="close"
    >
      <div
          class="w-full max-w-md flex flex-col gap-8 p-10 rounded-[40px] border shadow-2xl transition-all duration-500 scale-100"
          :style="{
          backgroundColor: theme?.countryModal.bg,
          borderColor: theme?.countryModal.border + '40'
        }"
      >
        <div class="flex flex-col gap-2 items-center text-center">
          <span class="text-[10px] font-black uppercase tracking-[0.4em] text-[#fbbf24] opacity-50">
            {{ langStore.currentLang === 'ru' ? 'Подтверждение' : 'Authorization' }}
          </span>
          <h2 class="text-3xl font-black text-white leading-tight uppercase tracking-tighter italic">
            {{ langStore.currentLang === 'ru' ? 'Разблокировать регион?' : 'Unlock Region?' }}
          </h2>
          <p class="text-sm text-white/40 font-medium">
            {{ langStore.currentLang === 'ru' ? 'Это действие добавит территорию в ваш журнал полетов.' : 'This action will add the territory to your flight log.' }}
          </p>
        </div>

        <div class="flex flex-col gap-3">
          <button
              @click="confirm"
              class="w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 outline-none border-none cursor-pointer"
              :style="{
              backgroundColor: theme?.countryModal.buttonConfirmBg,
              color: theme?.countryModal.buttonConfirmText
            }"
          >
            {{ langStore.currentLang === 'ru' ? 'Подтвердить' : 'Confirm Access' }}
          </button>

          <button
              @click="close"
              class="w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/5 outline-none border-none cursor-pointer"
              :style="{
              backgroundColor: theme?.countryModal.buttonCancelBg,
              color: theme?.countryModal.buttonCancelText
            }"
          >
            {{ langStore.currentLang === 'ru' ? 'Отмена' : 'Abort' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore'
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{
  theme: MapTheme
}>()

const uiStore = useUiStore()
const mapStore = useMapStore()
const langStore = useLangStore()

const close = () => {
  uiStore.setCountryModal(false)
  mapStore.pendingCountryId = null
}

const confirm = () => {
  if (mapStore.pendingCountryId) {
    mapStore.toggleCountry(mapStore.pendingCountryId)
  }
  close()
}
</script>