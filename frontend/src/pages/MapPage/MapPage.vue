<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none" :style="{ backgroundColor: store.currentTheme?.background || '#1c1c1f' }">
    <!-- Прорисовка карты -->
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <!-- Виджет статистики: НОВАЯ ЦВЕТОВАЯ ГАММА (Графит + Янтарный акцент) -->
    <div class="absolute top-12 left-12 flex flex-col gap-2 p-8 bg-[#18181b]/80 border border-[#fbbf24]/20 rounded-[40px] backdrop-blur-3xl pointer-events-none shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all">
      <span class="text-[11px] font-black uppercase tracking-[0.4em] text-[#fbbf24]">
        {{ langStore.currentLang === 'ru' ? 'Журнал' : 'Travel Log' }}
      </span>
      <div class="flex items-baseline gap-3">
        <span class="text-5xl font-black text-white leading-none tracking-tighter">{{ store.visited.length }}</span>
        <span class="text-[11px] text-white/40 font-bold uppercase tracking-widest">
          {{ langStore.currentLang === 'ru' ? 'Регионы' : 'Regions' }}
        </span>
      </div>
    </div>

    <div class="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-8 pointer-events-none">
      <SearchDock :key="store.currentTheme?.id" class="pointer-events-auto" :theme="store.currentTheme" @select="handleCountrySelect"/>
    </div>

    <Transition
        enter-active-class="transition-all duration-700 ease-out"
        enter-from-class="opacity-0 scale-105"
        leave-to-class="opacity-0 scale-95"
        leave-active-class="transition-all duration-700 ease-in"
    >
      <div v-if="isLoading" class="absolute inset-0 z-50">
        <!-- ВАЖНО: используем nextThemeId, чтобы сразу видеть будущую тему -->
        <WoodenLoader v-if="nextThemeId === 'wooden'" />
        <ClassicLoader v-else />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@/countries'
import { useMapStore } from '@/stores/mapStore'
import { useLangStore } from '@/stores/langStore'
import { MapRenderer } from '@/shared/lib/MapRenderer'
import { SearchDock } from '@/shared/ui/SearchDock'
import { WoodenLoader } from '@/shared/loaders/WoodenLoader'
import { ClassicLoader } from '@/shared/loaders/ClassicLoader'

interface CountryProperties {
  ISO_A3?: string
  iso_a3?: string
  name?: string
  [key: string]: string | number | boolean | undefined | null | object
}

interface CountryFeature extends d3.ExtendedFeature<d3.GeoGeometryObjects | null, CountryProperties> {
  properties: CountryProperties
}

const store = useMapStore()
const langStore = useLangStore()
const mapContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const nextThemeId = ref<string | null>(null)
let cachedFeatures: CountryFeature[] = []

const handleCountrySelect = (id: string) => {
  store.toggleCountry(id)
}

// Прорисовка карты (логика)
const drawMap = async () => {
  if (!mapContainer.value || !store.currentTheme) return
  const container = d3.select(mapContainer.value)
  container.selectAll('*').remove()

  try {
    if (cachedFeatures.length === 0) {
      const worldData = await d3.json('/data/custom.geo.json') as { features: CountryFeature[] }
      cachedFeatures = worldData.features.filter((f: CountryFeature) => {
        const id = f.properties.ISO_A3 || f.properties.iso_a3
        return !!id && ALL_COUNTRIES.some(c => c.id === id)
      })
    }

    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight

    const featureCollection: d3.ExtendedFeatureCollection<CountryFeature> = {
      type: "FeatureCollection",
      features: cachedFeatures
    }

    const projection = d3.geoMercator().fitSize(
        [width - 150, height - 150],
        featureCollection as unknown as Parameters<d3.GeoProjection['fitSize']>[1]
    )
    const pathGenerator = d3.geoPath().projection(projection)

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`) as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>

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
            store.toggleCountry(id)
          })
          .on('mouseover', function (this: SVGPathElement) {
            if (store.currentTheme?.id === 'classic') {
              const hoverColor = store.currentTheme.colors.map.hover
              // ПЛАВНОЕ НАВЕДЕНИЕ
              d3.select(this)
                  .interrupt() // Прерываем старую анимацию
                  .transition()
                  .duration(300)
                  .attr('fill', hoverColor)
            }
          })
          .on('mouseout', function (this: SVGPathElement) {
            if (store.currentTheme?.id === 'classic') {
              const isVisited = store.visited.includes(id)
              const originalColor = isVisited
                  ? store.currentTheme.colors.map.visited[0]
                  : store.currentTheme.colors.map.unvisited[0]

              // ПЛАВНОЕ ЗАТУХАНИЕ
              d3.select(this)
                  .interrupt()
                  .transition()
                  .duration(300)
                  .attr('fill', originalColor as string)
            }
          })
    })

    MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
  } catch (e) {
    console.error('Draw failed:', e)
  }
}

// Слушатель смены темы
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
          setTimeout(() => { nextThemeId.value = null }, 500)
        }, 1000)
      }, 1000)
    }
)

watch(
    () => store.visited.length,
    () => {
      const svg = d3.select(mapContainer.value).select<SVGSVGElement>('svg')
      if (store.currentTheme && !svg.empty()) MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
    }
)

onMounted(() => {
  setTimeout(() => {
    drawMap()
  }, 50)
  window.addEventListener('resize', drawMap)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawMap)
})
</script>