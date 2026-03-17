<template>
  <div
      class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none"
      :style="{ backgroundColor: store.currentTheme?.background || '#0c0c0e' }"
      @mousemove="handleGlobalMouseMove"
  >
    <!-- Отрисовка карты -->
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <!-- Подсказка (Label) -->
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
      <span class="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 leading-none" :style="{ color: store.currentTheme?.colors.ui.accent }">
        {{ langStore.currentLang === 'ru' ? 'Объект' : 'Target' }}
      </span>
      <span class="text-base font-black uppercase tracking-widest text-white italic leading-none mt-1">
        {{ hoveredCountryName }}
      </span>
    </div>

    <!-- Виджеты и компоненты (автоимпортируются) -->
    <div class="absolute top-12 left-12 z-40 flex flex-col gap-6 pointer-events-none">
      <StatsWidget :theme="store.currentTheme" class="pointer-events-auto" />
    </div>

    <div class="absolute top-12 right-12 z-40 pointer-events-none">
      <MapTools :theme="store.currentTheme" class="pointer-events-auto" />
    </div>

    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-8 pointer-events-none">
      <SearchDock :key="store.currentTheme?.id" class="pointer-events-auto" :theme="store.currentTheme" @select="handleCountrySelect" />
    </div>

    <CountryModal v-if="store.currentTheme" :theme="store.currentTheme" />
    <InfoModal v-if="store.currentTheme" :theme="store.currentTheme" />

    <Transition enter-active-class="transition-all duration-700 ease-out" enter-from-class="opacity-0 scale-105" leave-to-class="opacity-0 scale-95" leave-active-class="transition-all duration-700 ease-in">
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
import { MapRenderer } from '@shared/lib/MapRenderer'

// Типизация для D3
interface CountryProperties { ISO_A3?: string; iso_a3?: string }
type CountryFeature = d3.ExtendedFeature<d3.GeoGeometryObjects | null, CountryProperties>

// Сторы и хуки Vue (ref, watch, onMounted и т.д.) теперь ГЛОБАЛЬНЫЕ (импорт не нужен)
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
  const lang = langStore.currentLang as 'ru' | 'en'

  if (country) {
    hoveredCountryName.value = country.names[lang]
  } else {
    hoveredCountryName.value = (id as string) || null
  }
}

const handleCountrySelect = (id: string) => {
  store.toggleCountry(id)
}

const drawMap = async () => {
  if (!mapContainer.value || !store.currentTheme) return

  const currentTheme = store.currentTheme // Локальная переменная для стабильной типизации
  const container = d3.select(mapContainer.value)
  container.selectAll('*').remove()

  try {
    if (cachedFeatures.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const worldData = await d3.json('/data/custom.geo.json') as any
      cachedFeatures = worldData.features.filter((f: any) => {
        const id = f.properties.ISO_A3 || f.properties.iso_a3
        return !!id && ALL_COUNTRIES.some(c => c.id === id)
      })
    }

    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight
    const projection = d3.geoMercator().fitSize([width - 150, height - 150], { type: "FeatureCollection", features: cachedFeatures } as any)
    const pathGenerator = d3.geoPath().projection(projection)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const svg = container.append('svg').attr('width', width).attr('height', height) as any
    MapRenderer.setupDefinitions(svg)
    const g = svg.append('g').attr('transform', 'translate(75, 75)')

    cachedFeatures.forEach((feature: CountryFeature) => {
      const id = (feature.properties.ISO_A3 || feature.properties.iso_a3) as string
      const countryGroup = g.append('g').style('cursor', 'pointer')

      countryGroup.append('path')
          .datum(feature)
          .attr('class', `country-side side-${id}`)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('d', pathGenerator as any)
          .attr('transform', 'translate(1, 4.5)')

      countryGroup.append('path')
          .datum(feature)
          .attr('class', `country-top top-${id}`)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .attr('d', pathGenerator as any)
          .on('click', () => {
            store.pendingCountryId = id
            if (store.visited.includes(id)) {
              uiStore.setInfoModal(true)
            } else {
              uiStore.setCountryModal(true)
            }
          })
          .on('mouseenter', function (this: SVGPathElement, _event: any, d: CountryFeature) {
            d3.select(this)
                .interrupt()
                .transition()
                .duration(200)
                .attr('fill', currentTheme.colors.map.hover)
            updateHoveredCountry(d)
          })
          .on('mouseleave', function (this: SVGPathElement, _event: any, d: CountryFeature) {
            const isVisited = store.visited.includes(id)
            const visitedColor = currentTheme.colors.map.visited[0] || '#fbbf24'
            const unvisitedColor = currentTheme.colors.map.unvisited[0] || '#1a1a1c'

            d3.select(this)
                .interrupt()
                .transition()
                .duration(300)
                .attr('fill', isVisited ? visitedColor : unvisitedColor)
            hoveredCountryName.value = null
          })
    })

    MapRenderer.applyStyles(svg, currentTheme, store.visited)
  } catch (e) {
    console.error('Draw failed:', e)
  }
}

// Следим за сменой темы
watch(() => store.currentTheme?.id, async (newId) => {
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
})

// Следим за обновлением посещенных стран
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
})
</script>

<style scoped>
.fixed {
  will-change: left, top;
}
</style>