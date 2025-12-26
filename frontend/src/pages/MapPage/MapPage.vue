<template>
  <div class="w-full h-full bg-[#050505] flex items-center justify-center overflow-hidden relative">

    <!-- Карта -->
    <div ref="mapContainer" class="w-full h-full transition-opacity duration-700"></div>

    <!-- Статистика (No margin, только flex и gap) -->
    <div class="absolute top-10 left-10 flex flex-col gap-2 p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl pointer-events-none">
      <span class="text-[10px] text-blue-500 font-black uppercase tracking-[0.3em]">
        Progress
      </span>
      <div class="flex items-baseline gap-2">
        <span class="text-4xl font-black text-white leading-none">
          {{ store.visited.length }}
        </span>
        <span class="text-xs text-white/30 font-bold uppercase tracking-tight">
          Visited
        </span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@/countries'
import { useMapStore } from '@/stores/mapStore' // Импорт нашего нового стора

const store = useMapStore()
const mapContainer = ref<HTMLElement | null>(null)

const drawMap = async () => {
  if (!mapContainer.value) return
  const container = d3.select(mapContainer.value)
  container.selectAll('*').remove()

  try {
    const worldData = await d3.json('/data/custom.geo.json') as any
    const features = worldData.features.filter((f: any) => {
      const id = f.properties.ISO_A3 || f.properties.iso_a3
      return ALL_COUNTRIES.some(c => c.id === id)
    })

    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight

    const projection = d3.geoMercator().fitSize([width, height], {
      type: "FeatureCollection",
      features: features
    })

    const pathGenerator = d3.geoPath().projection(projection)
    const svg = container.append('svg').attr('width', width).attr('height', height)
    const g = svg.append('g')

    g.selectAll('path')
        .data(features)
        .enter()
        .append('path')
        .attr('d', pathGenerator as any)
        .attr('stroke', '#050505')
        .attr('stroke-width', 1.5)
        .attr('fill', (d: any) => {
          const id = d.properties.ISO_A3 || d.properties.iso_a3
          // Проверяем посещение через стор
          return store.visited.includes(id) ? '#3b82f6' : '#1a1a1a'
        })
        .attr('class', 'transition-all duration-500 cursor-pointer')
        .on('click', (event, d: any) => {
          const id = d.properties.ISO_A3 || d.properties.iso_a3
          store.toggleCountry(id)

          // Обновляем цвета всех путей плавно
          g.selectAll('path').transition().duration(500).attr('fill', (pd: any) => {
            const pid = pd.properties.ISO_A3 || pd.properties.iso_a3
            return store.visited.includes(pid) ? '#3b82f6' : '#1a1a1a'
          })
        })

  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  drawMap()
  window.addEventListener('resize', drawMap)
})
onUnmounted(() => window.removeEventListener('resize', drawMap))
</script>