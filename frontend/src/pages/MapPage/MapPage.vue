<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden relative transition-colors duration-1000 font-sans select-none" :style="{ backgroundColor: store.currentTheme?.background || '#050505' }">
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <div class="absolute top-10 left-10 flex flex-col gap-1 p-6 bg-white/40 border border-black/5 rounded-3xl backdrop-blur-xl pointer-events-none shadow-sm">
      <span class="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400" :style="{ color: store.currentTheme?.visited || '#fff' }">Travel Log</span>
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-black text-stone-800 leading-none">{{ store.visited.length }}</span>
        <span class="text-[10px] text-stone-500 font-bold uppercase tracking-tighter">Regions</span>
      </div>
    </div>

    <div class="absolute bottom-10 right-10 flex flex-col gap-4 p-6 bg-white/40 border border-black/5 rounded-3xl backdrop-blur-xl shadow-sm">
      <span class="text-[10px] text-stone-400 font-black uppercase tracking-[0.3em]">Ambience</span>
      <div class="flex gap-3">
        <button v-for="theme in themesList" :key="theme.id" @click="changeTheme(theme.id)" class="w-10 h-10 rounded-2xl border-2 transition-all duration-300 hover:scale-110 active:scale-90 shadow-sm" :class="store.currentTheme?.id === theme.id ? 'border-stone-800' : 'border-transparent'" :style="{ backgroundColor: theme.visited }"></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@/countries'
import { useMapStore } from '@/stores/mapStore'
import { MAP_THEMES } from '@/shared/map-themes'

const store = useMapStore()
const mapContainer = ref<HTMLElement | null>(null)
const themesList = Object.values(MAP_THEMES)
let cachedFeatures: any[] = []

// Палитра реальных пород дерева
const woodPalette = {
  visited: ['#5a3d2b', '#4a3222', '#6b4a36'], // Орех, Венге
  unvisited: ['#c4a484', '#b8926a', '#d2b48c'] // Дуб, Береза, Сосна
}

const getWoodBase = (iso: string, isVisited: boolean): string => {
  const charSum = iso.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const palette = isVisited ? woodPalette.visited : woodPalette.unvisited
  return (palette[charSum % palette.length] as string) || (palette[0] as string)
}

const updateMapStyles = () => {
  if (!mapContainer.value || !store.currentTheme) return
  const t = store.currentTheme
  const visitedList = [...store.visited]
  const svg = d3.select(mapContainer.value).select('svg')

  // БОКОВИНА (Эффект толщины)
  svg.selectAll('.country-side')
      .transition().duration(800)
      .attr('opacity', t.id === 'wooden' ? 1 : 0)
      .attr('fill', (d: any) => {
        const id = (d.properties.ISO_A3 || d.properties.iso_a3) as string
        const color = getWoodBase(id, visitedList.includes(id))
        return d3.color(color)?.darker(1.5).toString() || '#261910'
      })

  // ВЕРХНЯЯ ЧАСТЬ
  svg.selectAll('.country-top')
      .transition().duration(800)
      .attr('fill', (d: any) => {
        const id = (d.properties.ISO_A3 || d.properties.iso_a3) as string
        const isVisited = visitedList.includes(id)
        return getWoodBase(id, isVisited)
      })
      .attr('stroke', (t.id === 'wooden' ? '#261910' : t.border) as string)
      .attr('stroke-width', (t.id === 'wooden' ? 0.8 : t.strokeWidth) as number)
      .attr('filter', t.id === 'wooden' ? 'url(#wood-grain-filter) url(#soft-shadow)' : null)
}

const changeTheme = async (id: string) => {
  store.setTheme(id)
  await nextTick()
  updateMapStyles()
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

    const svg = container.append('svg').attr('width', width).attr('height', height)
    const defs = svg.append('defs')

    // 1. ФИЛЬТР ВОЛОКОН ДЕРЕВА (Wood Grain)
    const woodGrain = defs.append('filter').attr('id', 'wood-grain-filter')

    // Генерируем шум, растянутый по горизонтали (0.01 по X, 0.5 по Y)
    woodGrain.append('feTurbulence')
        .attr('type', 'fractalNoise')
        .attr('baseFrequency', '0.02 0.4')
        .attr('numOctaves', '3')
        .attr('result', 'noise')

    // Смешиваем шум с цветом страны (overlay)
    woodGrain.append('feComposite')
        .attr('in', 'SourceGraphic')
        .attr('in2', 'noise')
        .attr('operator', 'arithmetic')
        .attr('k1', '0.2') // Интенсивность волокон
        .attr('k2', '0.9')
        .attr('k3', '0')
        .attr('k4', '0')

    // 2. ФИЛЬТР ТЕНИ (3D Drop Shadow)
    const shadow = defs.append('filter').attr('id', 'soft-shadow').attr('height', '200%')
    shadow.append('feDropShadow')
        .attr('dx', '1.5').attr('dy', '3.5')
        .attr('stdDeviation', '2.5')
        .attr('flood-color', '#261910')
        .attr('flood-opacity', '0.45')

    const g = svg.append('g')

    cachedFeatures.forEach((feature: any) => {
      const id = (feature.properties.ISO_A3 || feature.properties.iso_a3) as string
      const countryGroup = g.append('g').style('cursor', 'pointer')

      // Слой "Толщина" (Срез)
      countryGroup.append('path')
          .datum(feature)
          .attr('class', 'country-side')
          .attr('d', pathGenerator as any)
          .attr('transform', 'translate(1, 4.5)')

      // Слой "Лицо" (Поверхность)
      countryGroup.append('path')
          .datum(feature)
          .attr('class', 'country-top transition-all duration-300 hover:brightness-110')
          .attr('d', pathGenerator as any)
          .attr('stroke-linejoin', 'round')
          .on('click', async () => {
            store.toggleCountry(id)
            await nextTick()
            updateMapStyles()
          })
    })

    updateMapStyles()
  } catch (e) {
    console.error(e)
  }
}

watch(() => store.currentTheme?.id, () => updateMapStyles())
watch(() => store.visited.length, () => updateMapStyles())

onMounted(() => {
  drawMap()
  window.addEventListener('resize', drawMap)
})

onUnmounted(() => {
  window.removeEventListener('resize', drawMap)
})
</script>