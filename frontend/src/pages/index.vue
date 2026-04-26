<template>
  <div class="w-full h-full relative bg-[var(--bg-main)] overflow-hidden font-sans select-none" @mousemove="handleGlobalMouseMove">
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-1000"></div>

    <div v-if="!isMobile && mapStore.showLabels && hoveredCountryName"
         class="fixed pointer-events-none z-[1000] flex flex-col gap-1 px-5 py-3 backdrop-blur-2xl border rounded-2xl shadow-2xl bg-black/95 border-[var(--ui-accent)]/50"
         :style="{ left: mousePos.x + 25 + 'px', top: mousePos.y - 40 + 'px' }"
    >
      <span class="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--ui-accent)]">{{ langStore.t.info.target }}</span>
      <span class="text-base font-black uppercase tracking-widest text-white italic mt-1 leading-none">{{ hoveredCountryName }}</span>
    </div>

    <div class="absolute top-8 left-8 z-40 hidden md:block pointer-events-none">
      <StatsWidget class="pointer-events-auto" />
    </div>

    <div class="absolute top-8 right-8 z-40 pointer-events-none">
      <MapTools />
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-6 pointer-events-none">
      <SearchDock class="pointer-events-auto" @select="handleSelect" />
    </div>

    <!-- Модалка разблокировки -->
    <CountryModal />
    <!-- Модалка с городами и прогрессом -->
    <InfoModal />

    <Transition enter-active-class="transition-opacity duration-500" leave-active-class="opacity-0">
      <div v-if="isLoading" class="absolute inset-0 z-[100]"><ClassicLoader /></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useMapEngine } from '@entities/map/lib/useMapEngine'
import { MapRenderer } from '@shared/lib/map-engine/MapRenderer'
import { useScreen } from '@shared/lib/useScreen'

const { isMobile } = useScreen()
const { mapContainer, isLoading, mousePos, hoveredCountryName, handleGlobalMouseMove } = useMapEngine()
const mapStore = useMapStore()
const uiStore = useUiStore()
const langStore = useLangStore()

const handleSelect = (id: string) => {
  if (!mapStore.currentTheme) return

  mapStore.pendingCountryId = id
  MapRenderer.flyTo(id, mapStore.currentTheme)

  // КОРРЕКТНЫЙ ВЫБОР МОДАЛКИ:
  if (mapStore.isUnlocked(id)) {
    uiStore.setInfoModal(true)
  } else {
    uiStore.setCountryModal(true)
  }
}

// СЛЕЖКА ЗА ЗАКРЫТИЕМ ЛЮБОЙ МОДАЛКИ
watch(
    () => [uiStore.isInfoModalOpen, uiStore.isCountryModalOpen],
    ([infoOpen, countryOpen]) => {
      // Если обе модалки закрыты - сбрасываем всё
      if (!infoOpen && !countryOpen) {
        if (mapStore.currentTheme) {
          MapRenderer.highlightCountry(null, mapStore.currentTheme)
        }
        mapStore.pendingCountryId = null
      }
    }
)
</script>