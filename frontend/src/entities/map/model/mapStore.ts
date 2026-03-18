import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as d3 from 'd3'
import { MAP_THEMES, type MapTheme } from '@entities/map/model'
import { ALL_COUNTRIES } from '@entities/country/model'
import type { CountryFeature } from '@shared/lib/MapRenderer'

export const useMapStore = defineStore('map', () => {
    const visited = ref<string[]>([])
    const currentThemeId = ref<string>('classic')
    const pendingCountryId = ref<string | null>(null)
    const showLabels = ref(false)

    // Данные карты
    const mapFeatures = ref<CountryFeature[]>([])
    const isDataLoading = ref(false)

    const themes = ref<Record<string, MapTheme>>({ ...MAP_THEMES })
    const currentTheme = computed(() => themes.value[currentThemeId.value] || themes.value.classic)

    const loadMapData = async () => {
        if (mapFeatures.value.length > 0) return
        isDataLoading.value = true
        try {
            const worldData = await d3.json('/data/custom.geo.json') as any
            mapFeatures.value = worldData.features.filter((f: any) => {
                const id = f.properties.ISO_A3 || f.properties.iso_a3
                return !!id && ALL_COUNTRIES.some(c => c.id === id)
            })
        } catch (e) {
            console.error('Failed to load map data:', e)
        } finally {
            isDataLoading.value = false
        }
    }

    const toggleCountry = (id: string) => {
        const index = visited.value.indexOf(id)
        if (index > -1) visited.value.splice(index, 1)
        else visited.value.push(id)
    }

    const setTheme = (themeId: string) => {
        if (themes.value[themeId]) currentThemeId.value = themeId
    }

    const resetVisited = () => {
        visited.value = []
    }

    return {
        visited, currentThemeId, currentTheme, themes,
        pendingCountryId, showLabels, mapFeatures, isDataLoading,
        loadMapData, setTheme, toggleCountry, resetVisited
    }
}, {
    persist: {
        pick: ['visited', 'currentThemeId', 'showLabels']
    }
})