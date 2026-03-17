<template>
  <div
      class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none"
      :style="{ backgroundColor: store.currentTheme?.background || '#0c0c0e' }"
      @mousemove="handleGlobalMouseMove"
  >
    <!-- Отрисовка карты -->
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <!-- Подсказка -->
    <div
        v-show="store.showLabels && hoveredCountryName"
        class="fixed pointer-events-none z-[1000] flex flex-col gap-1 px-5 py-3 backdrop-blur-2xl border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-opacity duration-200"
        :style="{
        left: mousePos.x + 25 + 'px',
        top: mousePos.y - 40 + 'px',
        backgroundColor: 'rgba(12, 12, 14, 0.98)',
        borderColor: store.currentTheme?.colors.ui.accent + '80'
      }"
    >
      <span
          class="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 leading-none"
          :style="{ color: store.currentTheme?.colors.ui.accent }"
      >
        {{ langStore.currentLang === 'ru' ? 'Объект' : 'Target' }}
      </span>
      <span class="text-base font-black uppercase tracking-widest text-white italic leading-none mt-1">
        {{ hoveredCountryName }}
      </span>
    </div>

    <!-- Виджеты -->
    <div class="absolute top-12 left-12 z-40 flex flex-col gap-6 pointer-events-none">
      <StatsWidget :theme="store.currentTheme" class="pointer-events-auto" />
    </div>

    <div class="absolute top-12 right-12 z-40 pointer-events-none">
      <MapTools :theme="store.currentTheme" class="pointer-events-auto" />
    </div>

    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-8 pointer-events-none">
      <SearchDock
          :key="store.currentTheme?.id"
          class="pointer-events-auto"
          :theme="store.currentTheme"
          @select="handleCountrySelect"
      />
    </div>

    <CountryModal v-if="store.currentTheme" :theme="store.currentTheme" />
    <InfoModal v-if="store.currentTheme" :theme="store.currentTheme" />

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
import {onMounted, ref, onUnmounted, watch, nextTick} from 'vue'
import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@entities/country/model'
import { useMapStore } from '@entities/map/model/mapStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'
import { useUiStore } from '@shared/lib/uiStore'
import { MapRenderer } from '@shared/lib/MapRenderer'
import { SearchDock } from '@widgets/search-dock'
import { WoodenLoader } from '@shared/loaders/WoodenLoader'
import { ClassicLoader } from '@shared/loaders/ClassicLoader'
import { CountryModal } from '@entities/country/ui'
import { InfoModal } from '@shared/ui/info-modal'
import { StatsWidget } from '@widgets/stats-widget'
import { MapTools } from '@widgets/map-tools'

// Интерфейсы
interface CountryProperties { ISO_A3?: string; iso_a3?: string }
interface CountryFeature extends d3.ExtendedFeature<d3.GeoGeometryObjects | null, CountryProperties> { properties: CountryProperties }

const store = useMapStore()
const langStore = useLangStore()
const uiStore = useUiStore()

const mapContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const nextThemeId = ref<string | null>(null)
const mousePos = ref({ x: 0, y: 0 })
const hoveredCountryName = ref<string | null>(null)
let cachedFeatures: CountryFeature[] = []

const handleGlobalMouseMove = (e: MouseEvent) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
}

const updateHoveredCountry = (feature: CountryFeature) => {
  if (!store.showLabels) {
    hoveredCountryName.value = null
    return
  }

  const id = feature.properties.ISO_A3 || feature.properties.iso_a3
  const country = ALL_COUNTRIES.find(c => c.id === id)

  if (country) {
    hoveredCountryName.value = langStore.currentLang === 'ru' ? country.names.ru : country.names.en
  } else {
    hoveredCountryName.value = id || null
  }
}

const handleCountrySelect = (id: string) => {
  store.toggleCountry(id)
}

const drawMap = async () => {
  if (!mapContainer.value || !store.currentTheme) return
  const container = d3.select(mapContainer.value)
  container.selectAll('*').remove()

  try {
    if (cachedFeatures.length === 0) {
      const worldData = await d3.json('/data/custom.geo.json') as d3.ExtendedFeatureCollection<CountryFeature>
      cachedFeatures = worldData.features.filter((f: CountryFeature) => {
        const id = f.properties.ISO_A3 || f.properties.iso_a3
        return !!id && ALL_COUNTRIES.some(c => c.id === id)
      })
    }

    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight
    const collection: d3.ExtendedFeatureCollection<CountryFeature> = { type: "FeatureCollection", features: cachedFeatures }

    const projection = d3.geoMercator().fitSize([width - 150, height - 150], collection)
    const pathGenerator = d3.geoPath().projection(projection)

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`) as d3.Selection<SVGSVGElement, unknown, null, undefined>

    MapRenderer.setupDefinitions(svg)
    const g = svg.append('g').attr('transform', 'translate(75, 75)')

    cachedFeatures.forEach((feature: CountryFeature) => {
      const id = (feature.properties.ISO_A3 || feature.properties.iso_a3) as string
      const countryGroup = g.append('g').style('cursor', 'pointer')

      countryGroup.append('path')
          .datum(feature)
          .attr('class', `country-side side-${id}`)
          .attr('d', (d) => pathGenerator(d as d3.GeoPermissibleObjects) || '')
          .attr('transform', 'translate(1, 4.5)')

      countryGroup.append('path')
          .datum(feature)
          .attr('class', `country-top top-${id}`)
          .attr('d', (d) => pathGenerator(d as d3.GeoPermissibleObjects) || '')
          .attr('stroke-linejoin', 'round')
          .on('click', () => {
            store.pendingCountryId = id
            if (store.visited.includes(id)) {
              uiStore.setInfoModal(true)
            } else {
              uiStore.setCountryModal(true)
            }
          })
          .on('mouseenter', function (_event: MouseEvent, d: CountryFeature) {
            if (store.currentTheme) {
              d3.select(this)
                  .interrupt()
                  .transition()
                  .duration(200)
                  .attr('fill', store.currentTheme.colors.map.hover)
            }
            updateHoveredCountry(d)
          })
          .on('mouseenter', function (_event: MouseEvent, d: CountryFeature) {
            if (store.currentTheme) {
              d3.select<SVGPathElement, CountryFeature>(this as SVGPathElement)
                  .interrupt()
                  .transition()
                  .duration(200)
                  .attr('fill', store.currentTheme.colors.map.hover)
            }
            updateHoveredCountry(d)
          })
          .on('mouseleave', function (_event: MouseEvent, d: CountryFeature) {
            if (store.currentTheme) {
              const countryId = d.properties.ISO_A3 || d.properties.iso_a3 || ''
              const isVisited = store.visited.includes(countryId)

              // Исправление ошибки: добавляем fallback значения и принудительный тип string
              const visitedColor: string = store.currentTheme.colors.map.visited[0] || '#fbbf24'
              const unvisitedColor: string = store.currentTheme.colors.map.unvisited[0] || '#1a1a1c'
              const finalColor: string = isVisited ? visitedColor : unvisitedColor

              d3.select<SVGPathElement, CountryFeature>(this as SVGPathElement)
                  .interrupt()
                  .transition()
                  .duration(300)
                  .attr('fill', finalColor)
            }
            hoveredCountryName.value = null
          })
    })

    MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
  } catch (e) { console.error('Draw failed:', e) }
}

watch(
    () => store.currentTheme?.id,
    async (newId) => {
      if (!newId) return
      nextThemeId.value = newId
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

watch(
    () => store.showLabels,
    (val) => {
      if (!val) {
        hoveredCountryName.value = null
      }
    }
)

watch(
    () => store.visited.length,
    () => {
      const svg = d3.select(mapContainer.value).select<SVGSVGElement>('svg')
      if (store.currentTheme && !svg.empty()) {
        MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
      }
    }
)

onMounted(() => {
  setTimeout(drawMap, 50)
  window.addEventListener('resize', drawMap)
  window.addEventListener('mousemove', handleGlobalMouseMove)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawMap)
  window.removeEventListener('mousemove', handleGlobalMouseMove)
})
</script>

<style scoped>
.fixed {
  will-change: left, top;
}
</style>