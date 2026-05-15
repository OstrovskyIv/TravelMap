<template>
  <div class="w-full h-full relative bg-[var(--bg-main)] overflow-hidden font-sans select-none" @mousemove="handleGlobalMouseMove">
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-1000"></div>

    <div v-if="!isMobile && mapStore.showLabels && mapStore.showCursorLabel && hoveredCountryName"
         class="fixed pointer-events-none z-[1000] flex flex-col gap-1 px-5 py-3 backdrop-blur-2xl border rounded-2xl shadow-2xl bg-black/95 border-[var(--ui-accent)]/50"
         :style="{ left: mousePos.x + 25 + 'px', top: mousePos.y - 40 + 'px' }"
    >
      <span class="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--ui-accent)] leading-none italic">
        {{ langStore.t.info.sector }}
      </span>
      <div class="flex items-center gap-2 mt-1">
        <span class="text-base font-black uppercase tracking-widest text-white italic leading-none">
          {{ hoveredCountryName }}
        </span>
      </div>
    </div>

    <div class="absolute top-8 left-8 z-40 hidden md:block pointer-events-none">
      <StatsWidget class="pointer-events-auto" />
    </div>

    <div v-if="uiStore.showMapTools" class="absolute top-8 right-8 z-40 pointer-events-none">
      <MapTools />
    </div>

    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-6 pointer-events-none">
      <SearchDock class="pointer-events-auto" @select="handleSelect" />
    </div>

    <CountryModal />
    <InfoModal />

    <Transition enter-active-class="transition-opacity duration-500" leave-active-class="opacity-0">
      <div v-if="isLoading || mapStore.isDataLoading" class="absolute inset-0 z-[100]"><ClassicLoader /></div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMapEngine } from '@entities/map/lib/useMapEngine'
import { MapRenderer } from '@shared/lib/map-engine/MapRenderer'
import { useScreen } from '@shared/lib/useScreen'
import { CountryModal, InfoModal } from '@entities/country/ui'
import { useUserStore } from '@entities/user/model/userStore'
import { useMapStore } from '@entities/map/model/mapStore'
import { useUiStore } from '@shared/lib/uiStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'

const { isMobile } = useScreen()
const mapStore = useMapStore()
const uiStore = useUiStore()
const userStore = useUserStore()
const langStore = useLangStore()

const { mapContainer, isLoading, mousePos, hoveredCountryName, handleGlobalMouseMove, draw } = useMapEngine()

onMounted(async () => {
  if (userStore.token) {
    await Promise.all([
      userStore.fetchProfile(),
      mapStore.fetchProgress()
    ])

    await draw()
  }
})

const handleSelect = (id: string) => {
  if (!mapStore.currentTheme) return
  mapStore.pendingCountryId = id
  MapRenderer.flyTo(id, mapStore.currentTheme)
  if (mapStore.isUnlocked(id)) uiStore.setInfoModal(true)
  else uiStore.setCountryModal(true)
}
</script>