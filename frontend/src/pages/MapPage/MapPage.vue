<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none" :style="{ backgroundColor: store.currentTheme?.background || '#050505' }">
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <div class="absolute top-10 left-10 flex flex-col gap-1 p-6 bg-white/40 border border-black/5 rounded-3xl backdrop-blur-xl pointer-events-none shadow-sm">
      <span class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400" :style="{ color: store.currentTheme?.colors.visited[0] || '#fff' }">Travel Log</span>
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-black text-stone-800 leading-none">{{ store.visited.length }}</span>
        <span class="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">Regions</span>
      </div>
    </div>

    <div class="absolute bottom-10 right-10 flex flex-col gap-4 p-6 bg-white/40 border border-black/5 rounded-3xl backdrop-blur-xl shadow-sm">
      <span class="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">Styles</span>
      <div class="flex gap-3">
        <button v-for="theme in themesList" :key="theme.id" @click="changeTheme(theme.id)" class="w-10 h-10 rounded-2xl border-2 transition-all duration-300 hover:scale-110 active:scale-90 shadow-sm" :class="store.currentTheme?.id === theme.id ? 'border-stone-800' : 'border-transparent'" :style="{ backgroundColor: Array.isArray(theme.colors.visited) ? theme.colors.visited[0] : theme.colors.visited }"></button>
      </div>
    </div>

    <!-- ОКНО ЗАГРУЗКИ БЕЗ БЛОКА STYLE -->
    <Transition
        enter-active-class="transition-opacity duration-500 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-500 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
      <div v-if="isLoading" class="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-md">
        <div class="flex flex-col items-center gap-5 p-10 bg-white/10 border border-white/10 rounded-[40px] backdrop-blur-2xl shadow-2xl">
          <div class="w-12 h-12 border-4 border-t-white/80 border-white/10 rounded-full animate-spin"></div>
          <div class="flex flex-col items-center gap-1 text-center">
            <span class="text-[10px] text-white/60 font-black uppercase tracking-[0.5em]">Reconfiguring</span>
            <span class="text-[9px] text-white/30 font-mono uppercase tracking-widest italic leading-none">Applying visual engine...</span>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@/countries'
import { useMapStore } from '@/stores/mapStore'
import { MAP_THEMES } from '@/shared/map-themes'
import { MapRenderer } from '@/shared/lib/MapRenderer'

const store = useMapStore()
const mapContainer = ref<HTMLElement | null>(null)
const themesList = Object.values(MAP_THEMES)
const isLoading = ref(false)
let cachedFeatures: any[] = []

const changeTheme = async (id: string) => {
  if (id === store.currentTheme?.id) return
  isLoading.value = true

  setTimeout(async () => {
    store.setTheme(id)
    await nextTick()

    const svg = d3.select(mapContainer.value).select('svg')
    if (store.currentTheme) {
      MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
    }

    setTimeout(() => {
      isLoading.value = false
    }, 600)
  }, 300)
}

const drawMap = async () => {
  if (!mapContainer.value || !store.currentTheme) return
  const container = d3.select(mapContainer.value)
  container.selectAll('*').remove()

  try {
    if (cachedFeatures.length === 0) {
      const worldData = await d3.json('/data/custom.geo.json') as any
      cachedFeatures = worldData.features.filter((f: any) => {
        const id = f.properties.ISO_A3 || f.properties.iso_a3
        return ALL_COUNTRIES.some(c => c.id === id)
      })
    }

    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight
    const projection = d3.geoMercator().fitSize([width, height], { type: "FeatureCollection", features: cachedFeatures })
    const pathGenerator = d3.geoPath().projection(projection)
    const svg = container.append('svg').attr('width', width).attr('height', height) as any

    MapRenderer.setupDefinitions(svg)

    const g = svg.append('g')

    cachedFeatures.forEach((feature: any) => {
      const id = (feature.properties.ISO_A3 || feature.properties.iso_a3) as string
      const countryGroup = g.append('g').style('cursor', 'pointer')

      countryGroup.append('path').datum(feature).attr('class', `country-side side-${id}`).attr('d', pathGenerator as any).attr('transform', 'translate(1, 4.5)')
      countryGroup.append('path').datum(feature).attr('class', `country-top top-${id} transition-all duration-300 hover:brightness-110`).attr('d', pathGenerator as any).attr('stroke-linejoin', 'round').on('click', () => {
        store.toggleCountry(id)
        MapRenderer.applyStyles(svg, store.currentTheme!, store.visited)
      })
    })

    MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
  } catch (e) {
    console.error(e)
  }
}

watch(
    () => store.currentTheme?.id,
    () => {
      const svg = d3.select(mapContainer.value).select('svg')
      if (store.currentTheme) MapRenderer.applyStyles(svg, store.currentTheme, store.visited)
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