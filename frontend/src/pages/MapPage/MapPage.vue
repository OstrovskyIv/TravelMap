<template>
  <div class="w-full h-full bg-[#050505] flex items-center justify-center overflow-hidden">
    <div ref="mapContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from 'vue'
import * as d3 from 'd3'
import { ALL_COUNTRIES, findCountry } from '@/countries'

// Ссылка на контейнер для D3
const mapContainer = ref<HTMLElement | null>(null)

const drawMap = async () => {
  if (!mapContainer.value) return

  // Очищаем старую карту перед перерисовкой (важно для resize)
  d3.select(mapContainer.value).selectAll('*').remove()

  try {
    // 1. Загружаем общий GeoJSON мира
    const worldData = await d3.json('/data/custom.geo.json') as any
    if (!worldData) return

    // 2. ФИЛЬТРАЦИЯ: Оставляем только те страны, файлы которых у нас есть
    const myCountriesFeatures = worldData.features.filter((f: any) => {
      const id = f.properties.ISO_A3 || f.properties.iso_a3
      // Проверяем наличие ID в нашем массиве из /countries/index.ts
      return ALL_COUNTRIES.some(c => c.id === id)
    })

    // Если мы еще не добавили ни одной страны, выходим, чтобы не было ошибок
    if (myCountriesFeatures.length === 0) {
      console.warn("Нет данных для отображения. Добавьте хотя бы один .ts файл в папку countries.")
      return
    }

    // 3. Размеры контейнера
    const width = mapContainer.value.clientWidth
    const height = mapContainer.value.clientHeight

    // 4. НАСТРОЙКА ПРОЕКЦИИ (Авто-зум)
    // fitSize автоматически подбирает масштаб и центр под наши страны
    const projection = d3.geoMercator().fitSize([width, height], {
      type: "FeatureCollection",
      features: myCountriesFeatures
    })

    const pathGenerator = d3.geoPath().projection(projection)

    // 5. СОЗДАНИЕ SVG
    const svg = d3.select(mapContainer.value)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0 0 ${width} ${height}`)
        .attr('class', 'block')

    // 6. ОТРИСОВКА СТРАН
    svg.append('g')
        .selectAll('path')
        .data(myCountriesFeatures)
        .enter()
        .append('path')
        .attr('d', pathGenerator as any)
        // Стили через Tailwind и атрибуты
        .attr('fill', '#3b82f6') // Синий цвет по умолчанию (Tailwind blue-500)
        .attr('stroke', '#1e40af') // Темно-синие границы (Tailwind blue-800)
        .attr('stroke-width', 1)
        .attr('class', 'transition-all duration-300 cursor-pointer hover:fill-blue-400')

        // ИНТЕРАКТИВНОСТЬ
        .on('click', (event, d: any) => {
          const id = d.properties.ISO_A3 || d.properties.iso_a3
          const country = findCountry(id)
          if (country) {
            alert(`Страна: ${country.name}\nГорода в базе: ${country.cities.join(', ')}`)
          }
        })

  } catch (error) {
    console.error('Ошибка отрисовки карты:', error)
  }
}

const handleResize = () => drawMap()

onMounted(() => {
  drawMap()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>