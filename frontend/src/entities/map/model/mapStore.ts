import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { MAP_THEMES, type MapTheme } from '@entities/map/model'

export const useMapStore = defineStore('map', () => {
    const visited = ref<string[]>([])
    const currentThemeId = ref<string>('classic')
    const zoomLevel = ref(1)
    const showLabels = ref(false)
    const mapFeatures = shallowRef<any[]>([])
    const isDataLoading = ref(false)
    const pendingCountryId = ref<string | null>(null)

    const themes = ref<Record<string, MapTheme>>({ ...MAP_THEMES })
    const currentTheme = computed(() => themes.value[currentThemeId.value] || themes.value.classic)

    const setZoom = (val: number) => {
        zoomLevel.value = Math.max(1, Math.min(15, val))
    }

    const setTheme = (id: string) => {
        if (themes.value[id]) {
            currentThemeId.value = id
        }
    }

    const toggleCountry = (id: string) => {
        const index = visited.value.indexOf(id)
        if (index > -1) visited.value.splice(index, 1)
        else visited.value.push(id)
    }

    const loadMapData = async () => {
        if (mapFeatures.value.length > 0) return
        isDataLoading.value = true
        try {
            const d3 = await import('d3')
            const worldData = await d3.json(`${import.meta.env.BASE_URL}data/custom.geo.json`) as any
            mapFeatures.value = worldData.features
        } catch (e) {
            console.error('Failed to load map data:', e)
        } finally {
            isDataLoading.value = false
        }
    }

    return {
        visited, currentThemeId, currentTheme, themes, zoomLevel,
        pendingCountryId, showLabels, mapFeatures, isDataLoading,
        loadMapData, setZoom, toggleCountry, setTheme
    }
}, {
    persist: {
        pick: ['visited', 'currentThemeId', 'showLabels']
    }
})