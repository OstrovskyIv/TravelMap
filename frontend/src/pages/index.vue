<template>
  <div
      class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none"
      :style="{ backgroundColor: store.currentTheme?.background || '#0c0c0e' }"
      @mousemove="handleGlobalMouseMove"
  >
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <div
        v-show="store.showLabels && hoveredCountryName"
        class="fixed pointer-events-none z-[1000] flex flex-col gap-1 px-5 py-3 backdrop-blur-2xl border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
        :style="{
          left: mousePos.x + 25 + 'px',
          top: mousePos.y - 40 + 'px',
          backgroundColor: 'rgba(12, 12, 14, 0.98)',
          borderColor: store.currentTheme?.colors.ui.accent + '80'
        }"
    >
      <span class="text-[9px] font-black uppercase tracking-[0.4em] opacity-40" :style="{ color: store.currentTheme?.colors.ui.accent }">
        {{ langStore.currentLang === 'ru' ? 'Объект' : 'Target' }}
      </span>
      <span class="text-base font-black uppercase tracking-widest text-white italic mt-1 leading-none">
        {{ hoveredCountryName }}
      </span>
    </div>

    <div class="absolute top-12 left-12 z-40 flex flex-col gap-6 pointer-events-none">
      <StatsWidget :theme="store.currentTheme" class="pointer-events-auto" />
    </div>
    <div class="absolute top-12 right-12 z-40 pointer-events-none">
      <MapTools :theme="store.currentTheme" class="pointer-events-auto" />
    </div>
    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-8 pointer-events-none">
      <SearchDock :key="store.currentTheme?.id" class="pointer-events-auto" :theme="store.currentTheme" @select="store.toggleCountry" />
    </div>

    <template v-if="store.currentTheme">
      <CountryModal :theme="store.currentTheme" />
      <InfoModal :theme="store.currentTheme" />
    </template>

    <Transition
        enter-active-class="transition-all duration-700 ease-out"
        enter-from-class="opacity-0 scale-105"
        leave-to-class="opacity-0 scale-95"
        leave-active-class="transition-all duration-700 ease-in"
    >
      <div v-if="isLoading" class="absolute inset-0 z-[100]">
        <WoodenLoader v-if="nextThemeId === 'wooden'" />
        <ClassicLoader v-else />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@entities/country/model'
import { MapRenderer, type CountryFeature } from '@shared/lib/MapRenderer'

const store = useMapStore()
const langStore = useLangStore()
const uiStore = useUiStore()

const mapContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const nextThemeId = ref<string | null>(null)
const mousePos = ref({ x: 0, y: 0 })
const hoveredCountryName = ref<string | null>(null)

const handleGlobalMouseMove = (e: MouseEvent) => { mousePos.value = { x: e.clientX, y: e.clientY } }

const handleHover = (feature: CountryFeature | null) => {
  if (!feature || !store.showLabels) { hoveredCountryName.value = null; return }
  const id = feature.properties.ISO_A3 || feature.properties.iso_a3
  const country = ALL_COUNTRIES.find(c => c.id === id)
  const lang = langStore.currentLang as 'ru' | 'en'
  hoveredCountryName.value = country ? country.names[lang] : (id as string)
}

const handleClick = (id: string) => {
  store.pendingCountryId = id
  if (store.visited.includes(id)) uiStore.setInfoModal(true)
  else uiStore.setCountryModal(true)
}

const drawMap = async () => {
  if (!mapContainer.value || !store.currentTheme) return

  try {
    if (store.mapFeatures.length === 0) {
      await store.loadMapData()
    }

    MapRenderer.renderMap({
      container: mapContainer.value,
      features: store.mapFeatures,
      theme: store.currentTheme,
      visited: store.visited,
      onCountryClick: handleClick,
      onCountryHover: handleHover
    })
  } catch (e) {
    console.error('Map Draw Failed:', e)
  }
}

watch(
    () => store.currentTheme?.id,
    async (newId, oldId) => {
      if (!oldId) {
        await nextTick()
        await drawMap()
        return
      }

      nextThemeId.value = newId || null
      isLoading.value = true

      setTimeout(async () => {
        await nextTick()
        await drawMap()
        setTimeout(() => {
          isLoading.value = false
          nextThemeId.value = null
        }, 1000)
      }, 1000)
    }
)

watch(() => store.visited.length, () => {
  const svg = d3.select(mapContainer.value).select<SVGSVGElement>('svg')
  if (store.currentTheme && !svg.empty()) {
    MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
  }
})

onMounted(() => {
  setTimeout(drawMap, 50)
  window.addEventListener('resize', drawMap)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawMap)
  uiStore.setInfoModal(false)
  uiStore.setCountryModal(false)
})
</script>

<style scoped>
.fixed {
  will-change: left, top;
}
</style>