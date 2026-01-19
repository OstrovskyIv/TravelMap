<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none" :style="{ backgroundColor: store.currentTheme?.background || '#050505' }">
    <!-- Прорисовка карты -->
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <div class="absolute top-12 left-12 flex flex-col gap-2 p-8 bg-white/40 border border-white/10 rounded-[40px] backdrop-blur-xl pointer-events-none shadow-2xl transition-all">
      <span class="text-[11px] font-black uppercase tracking-[0.4em] opacity-40" :style="{ color: (Array.isArray(store.currentTheme?.colors.visited) ? store.currentTheme?.colors.visited[0] : store.currentTheme?.colors.visited) || '#fff' }">
        {{ langStore.currentLang === 'ru' ? 'Журнал' : 'Travel Log' }}
      </span>
      <div class="flex items-baseline gap-3">
        <span class="text-5xl font-black text-stone-800 leading-none tracking-tighter">{{ store.visited.length }}</span>
        <span class="text-[11px] text-stone-500 font-bold uppercase tracking-widest">
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
        .attr('height', height) as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>

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
          .attr('class', `country-top top-${id} transition-all duration-300 hover:brightness-110`)
          .attr('d', (d) => pathGenerator(d as d3.GeoPermissibleObjects) || '')
          .attr('stroke-linejoin', 'round')
          .on('click', () => {
            store.toggleCountry(id)
          })
          .on('mouseover', function(this: SVGPathElement) {
            if (store.currentTheme?.id === 'classic') d3.select(this).attr('fill', '#444')
          })
          .on('mouseout', function(this: SVGPathElement) {
            if (store.currentTheme?.id === 'classic') MapRenderer.applyStyles(svg, store.currentTheme!, store.visited)
          })
    })

    if (store.currentTheme.id === 'wooden') {
      g.append('g').attr('class', 'map-labels').selectAll('text').data(cachedFeatures).enter().append('text')
          .attr('x', (d) => (projection(d3.geoCentroid(d as d3.GeoPermissibleObjects)) || [0, 0])[0])
          .attr('y', (d) => (projection(d3.geoCentroid(d as d3.GeoPermissibleObjects)) || [0, 0])[1])
          .attr('text-anchor', 'middle').attr('font-size', '7px').attr('font-weight', 'bold').attr('fill', '#1a0f08').attr('pointer-events', 'none')
          .text((d) => d.properties.name?.toString().toUpperCase() || '')
    }

    MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
  } catch (e) {
    console.error('Draw failed:', e)
  }
}

watch(
    () => store.currentTheme?.id,
    async (newId) => {
      if (!newId) return
      nextThemeId.value = newId
      isLoading.value = true

      setTimeout(async () => {
        await nextTick()
        const svg = d3.select(mapContainer.value).select<SVGSVGElement>('svg')
        if (store.currentTheme && !svg.empty()) {
          MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
        }
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
  drawMap()
  window.addEventListener('resize', drawMap)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawMap)
})
</script>