<template>
  <div class="w-full h-full relative bg-[var(--bg-main)] overflow-hidden font-sans select-none">

    <div ref="mapContainer" class="w-full h-full transition-opacity duration-1000"></div>

    <div class="absolute top-8 left-8 z-40 hidden md:block pointer-events-none">
      <StatsWidget class="pointer-events-auto" />
    </div>

    <div class="absolute top-8 right-8 z-40 pointer-events-none">
      <MapTools />
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-6 pointer-events-none">
      <SearchDock class="pointer-events-auto" @select="handleSelect" />
    </div>

    <CountryModal />
    <InfoModal />

    <Transition enter-active-class="transition-opacity duration-500" leave-active-class="opacity-0">
      <div v-if="isLoading" class="absolute inset-0 z-[100]"><ClassicLoader /></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useMapEngine } from '@entities/map/lib/useMapEngine'
import { MapRenderer } from '@shared/lib/MapRenderer'
import { useScreen } from '@shared/lib/useScreen'

const { isMobile } = useScreen()
const { mapContainer, isLoading } = useMapEngine()
const mapStore = useMapStore()
const uiStore = useUiStore()

const handleSelect = (id: string) => {
  if (!mapStore.currentTheme) return
  mapStore.pendingCountryId = id
  MapRenderer.flyTo(id, mapStore.currentTheme)

  if (mapStore.visited.includes(id)) uiStore.setInfoModal(true)
  else uiStore.setCountryModal(true)
}

// СЛЕЖКА ЗА ЗАКРЫТИЕМ МОДАЛОК
watch(
    () => [uiStore.isInfoModalOpen, uiStore.isCountryModalOpen],
    ([infoOpen, countryOpen]) => {
      // Если обе модалки закрыты - убираем подсветку в MapRenderer
      if (!infoOpen && !countryOpen && mapStore.currentTheme) {
        MapRenderer.highlightCountry(null, mapStore.currentTheme)
      }
    }
)
</script>