<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none" :style="{ backgroundColor: store.currentTheme?.background || '#050505' }">
    <!-- Прорисовка карты -->
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <div class="absolute top-10 left-10 flex flex-col gap-1 p-6 bg-white/40 border border-black/5 rounded-3xl backdrop-blur-xl pointer-events-none shadow-sm">
      <span class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400" :style="{ color: (Array.isArray(store.currentTheme?.colors.visited) ? store.currentTheme?.colors.visited[0] : store.currentTheme?.colors.visited) || '#fff' }">
        {{ langStore.currentLang === 'ru' ? 'Журнал' : 'Travel Log' }}
      </span>
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-black text-stone-800 leading-none">{{ store.visited.length }}</span>
        <span class="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">
          {{ langStore.currentLang === 'ru' ? 'Регионы' : 'Regions' }}
        </span>
      </div>
    </div>

    <div class="absolute bottom-32 right-10 z-40">
      <LangSwitcher :theme="store.currentTheme" />
    </div>

    <div class="absolute bottom-10 right-10 flex flex-col gap-4 p-6 bg-white/40 border border-black/5 rounded-3xl backdrop-blur-xl shadow-sm">
      <span class="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">
        {{ langStore.currentLang === 'ru' ? 'Стили' : 'Styles' }}
      </span>
      <div class="flex gap-3">
        <button v-for="theme in themesList" :key="theme.id" @click="changeTheme(theme.id)" class="w-10 h-10 rounded-2xl border-2 transition-all duration-300 hover:scale-110 active:scale-90 shadow-sm" :class="store.currentTheme?.id === theme.id ? 'border-stone-800' : 'border-transparent'" :style="{ backgroundColor: Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : (theme.colors.visited as string) }"></button>
      </div>
    </div>

    <!-- Поиск -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-6 pointer-events-none">
      <SearchDock class="pointer-events-auto" :theme="store.currentTheme" @select="handleCountrySelect"/>
    </div>

    <Transition
        enter-active-class="transition-all duration-700 ease-out"
        enter-from-class="opacity-0 scale-105"
        leave-to-class="opacity-0 scale-95"
        leave-active-class="transition-all duration-700 ease-in">
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
import { MAP_THEMES } from '@/shared/map-themes'
import { MapRenderer } from '@/shared/lib/MapRenderer'
import { SearchDock } from '@/shared/ui/SearchDock'
import { LangSwitcher } from '@/shared/ui/LangSwitcher'

import { WoodenLoader } from '@/shared/loaders/WoodenLoader'
import { ClassicLoader } from '@/shared/loaders/ClassicLoader'

interface CountryFeature {
  type: string;
  properties: {
    ISO_A3?: string
    iso_a3?: string
    name?: string
    [key: string]: unknown
  }
  geometry: unknown
}

const store = useMapStore()
const langStore = useLangStore()
const mapContainer = ref<HTMLElement | null>(null)
const themesList = Object.values(MAP_THEMES)
const isLoading = ref(false)
const nextThemeId = ref<string | null>(null)
let cachedFeatures: CountryFeature[] = []

const handleCountrySelect = (id: string) => {
  store.toggleCountry(id)
}

// Метод для смены темы
const changeTheme = async (id: string) => {
  if (id === store.currentTheme?.id) return

  nextThemeId.value = id
  isLoading.value = true

  setTimeout(async () => {
    store.setTheme(id)
    await nextTick()

    const svg = d3.select(mapContainer.value).select<SVGSVGElement>('svg')
    if (store.currentTheme && !svg.empty()) {
      MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
    }

    setTimeout(() => {
      isLoading.value = false
      setTimeout(() => {
        nextThemeId.value = null
      }, 500)
    }, 1000)
  }, 1000)
}

// Прорисовка карты (логика)
const drawMap = async () => {
  if (!mapContainer.value || !store.currentTheme) return
  const container = d3.select(mapContainer.value)
  container.selectAll('*').remove() // Полная очистка перед перерисовкой

  try {
    if (cachedFeatures.length === 0) {
      const worldData = await d3.json('/data/custom.geo.json') as { features: CountryFeature[] }
      cachedFeatures = worldData.features.filter((f: CountryFeature) => {
        const id = f.properties.ISO_A3 || f.properties.iso_a3
        return id && ALL_COUNTRIES.some(c => c.id === id)
      })
    }

    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight

    const projection = d3.geoMercator().fitSize([width, height], {
      type: "FeatureCollection",
      features: cachedFeatures as unknown as d3.ExtendedFeature[]
    })
    const pathGenerator = d3.geoPath().projection(projection)

    const svg = container.append('svg')
        .attr('width', width)
        .attr('height', height) as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>

    MapRenderer.setupDefinitions(svg)

    const g = svg.append('g')

    // Слои для стран
    cachedFeatures.forEach((feature: CountryFeature) => {
      const id = (feature.properties.ISO_A3 || feature.properties.iso_a3) as string
      const countryGroup = g.append('g').style('cursor', 'pointer')

      // Для толщины
      countryGroup.append('path')
          .datum(feature)
          .attr('class', `country-side side-${id}`)
          .attr('d', pathGenerator as unknown as (d: CountryFeature) => string)
          .attr('transform', 'translate(1, 4.5)')

      // Передний слой
      countryGroup.append('path')
          .datum(feature)
          .attr('class', `country-top top-${id} transition-all duration-300 hover:brightness-110`)
          .attr('d', pathGenerator as unknown as (d: CountryFeature) => string)
          .attr('stroke-linejoin', 'round')
          .on('click', () => {
            store.toggleCountry(id)
            if (store.currentTheme) {
              MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
            }
          })
    })

    MapRenderer.applyStyles(svg, store.currentTheme, store.visited)

  } catch (e) {
    console.error('Draw failed:', e)
  }
}

watch(
    () => store.currentTheme?.id,
    () => {
      const svg = d3.select(mapContainer.value).select<SVGSVGElement>('svg')
      if (store.currentTheme && !svg.empty()) MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
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