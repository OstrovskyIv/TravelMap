<template>
  <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0 scale-95"
      leave-active-class="transition-all duration-300 ease-in"
      leave-to-class="opacity-0 scale-95"
  >
    <div
        v-if="uiStore.isInfoModalOpen"
        class="fixed inset-0 z-[110] flex items-center justify-center p-12 backdrop-blur-2xl"
        :style="{ backgroundColor: theme?.infoModal.overlay }"
        @click.self="close"
    >
      <div
          class="w-full h-full max-w-[1500px] max-h-[850px] flex overflow-hidden rounded-[60px] border shadow-[0_60px_150px_rgba(0,0,0,0.9)] relative"
          :style="{ backgroundColor: theme?.infoModal.bg, borderColor: theme?.infoModal.border }"
      >
        <div class="flex-1 relative bg-black/40 overflow-hidden border-r border-white/5">
          <div ref="miniMapContainer" class="w-full h-full"></div>
          <div class="absolute bottom-12 left-12 flex flex-col gap-1 opacity-20 text-white font-mono text-[10px] tracking-[0.5em]">
            <span class="font-black text-[#fbbf24]">SCANNER_MODE: GEOPOSITION_ACTIVE</span>
            <span>SELECTED_ID: {{ mapStore.pendingCountryId }}</span>
          </div>
        </div>

        <div class="w-[550px] flex flex-col gap-12 p-16 overflow-y-auto custom-scrollbar">
          <div class="flex flex-col gap-4">
            <div class="flex justify-between items-start">
              <span class="text-[10px] font-black uppercase tracking-[0.7em]" :style="{ color: theme?.infoModal.accent }">
                {{ langStore.currentLang === 'ru' ? 'Сектор разведки' : 'Sector Intelligence' }}
              </span>
              <button @click="close" class="w-12 h-12 rounded-2xl bg-white/5 hover:bg-red-500 transition-all flex items-center justify-center text-white border-none outline-none cursor-pointer">✕</button>
            </div>
            <h2 class="text-6xl font-black text-white uppercase tracking-tighter italic leading-none">
              {{ countryData?.names[langStore.currentLang as 'ru' | 'en'] }}
            </h2>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div v-for="(val, key) in countryData?.stats" :key="key" class="flex flex-col gap-1 p-5 bg-white/5 rounded-[24px] border border-white/5">
              <span class="text-[8px] uppercase opacity-30 font-black text-white tracking-widest">{{ key }}</span>
              <span class="text-xs font-bold text-white uppercase tracking-tighter">{{ val }}</span>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Briefing</h3>
            <p class="text-base text-white/60 leading-relaxed font-medium italic">
              {{ countryData?.description[langStore.currentLang as 'ru' | 'en'] }}
            </p>
          </div>

          <div class="flex flex-col gap-6">
            <div class="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-white">
                {{ langStore.currentLang === 'ru' ? 'Активные узлы' : 'Active Nodes' }}
              </h3>
            </div>
            <div class="flex flex-col gap-2">
              <div v-for="city in countryData?.cities" :key="city.id" class="group flex items-center justify-between p-6 rounded-[28px] bg-white/[0.02] border border-white/5 hover:border-[#fbbf24]/40 transition-all cursor-pointer" @mouseenter="highlightCity(city.id)" @mouseleave="highlightCity(null)">
                <div class="flex flex-col gap-1">
                  <span class="text-sm font-black text-white opacity-40 group-hover:opacity-100 group-hover:text-[#fbbf24] transition-all uppercase tracking-widest">
                    <!-- ИСПРАВЛЕНО: добавлено as 'ru' | 'en' -->
                    {{ city.names[langStore.currentLang as 'ru' | 'en'] }}
                  </span>
                  <span class="text-[8px] font-mono text-white/10 group-hover:text-white/30 tracking-tighter">
                    LAT: {{ city.coords.lat }} / LNG: {{ city.coords.lng }}
                  </span>
                </div>
                <span v-if="city.isCapital" class="text-[7px] font-black text-black bg-[#fbbf24] px-2 py-0.5 rounded-md uppercase tracking-tighter">Capital</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import * as d3 from 'd3'
import { useUiStore } from '@shared/lib/uiStore'
import { useMapStore } from '@entities/map/model/mapStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'
import { ALL_COUNTRIES } from '@entities/country/model'
import type { MapTheme } from '@entities/map/model/types'

const props = defineProps<{ theme: MapTheme }>()
const uiStore = useUiStore()
const mapStore = useMapStore()
const langStore = useLangStore()
const miniMapContainer = ref<HTMLElement | null>(null)

const countryData = computed(() => ALL_COUNTRIES.find(c => c.id === mapStore.pendingCountryId))

const drawMiniMap = async () => {
  if (!miniMapContainer.value || !mapStore.pendingCountryId) return
  const container = d3.select(miniMapContainer.value)
  container.selectAll('*').remove()

  try {
    const worldData = await d3.json('/data/custom.geo.json') as any
    const feature = worldData.features.find((f: any) =>
        (f.properties.ISO_A3 || f.properties.iso_a3) === mapStore.pendingCountryId
    )
    if (!feature) return

    const width = miniMapContainer.value.clientWidth
    const height = miniMapContainer.value.clientHeight
    const projection = d3.geoMercator().fitSize([width - 150, height - 150], feature as any)
    const pathGenerator = d3.geoPath().projection(projection)

    const svg = container.append('svg').attr('width', width).attr('height', height)
    const g = svg.append('g').attr('transform', 'translate(75, 75)')

    g.append('path')
        .datum(feature)
        .attr('d', pathGenerator as any)
        .attr('fill', 'rgba(255,255,255,0.03)')
        .attr('stroke', props.theme.colors.ui.accent)
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.5)

    if (countryData.value?.cities) {
      const citiesGroup = g.append('g')
      countryData.value.cities.forEach((city: any) => {
        const [x, y] = projection([city.coords.lng, city.coords.lat]) || [0, 0]
        const node = citiesGroup.append('g').attr('class', `city-node city-${city.id}`).attr('transform', `translate(${x}, ${y})`)
        node.append('circle').attr('r', city.isCapital ? 8 : 5).attr('fill', props.theme.colors.ui.accent).attr('opacity', 0.2)
        node.append('circle').attr('r', city.isCapital ? 3.5 : 2).attr('fill', props.theme.colors.ui.accent).attr('stroke', '#000').attr('stroke-width', 1)
      })
    }
  } catch (e) { console.error('MiniMap fail:', e) }
}

const highlightCity = (cityId: string | null) => {
  d3.selectAll('.city-node').transition().duration(300).attr('opacity', cityId ? 0.2 : 1)
  if (cityId) d3.select(`.city-${cityId}`).transition().duration(300).attr('opacity', 1)
}

watch(() => uiStore.isInfoModalOpen, async (val) => {
  if (val) {
    await nextTick()
    setTimeout(drawMiniMap, 150)
  }
})

const close = () => { uiStore.setInfoModal(false) }
</script>