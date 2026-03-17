import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { MAP_THEMES, type MapTheme } from '@entities/map/model'

export const useMapStore = defineStore('map', () => {
    const visited = ref<string[]>([])
    const currentThemeId = ref<string>('classic')
    const pendingCountryId = ref<string | null>(null)
    const showLabels = ref(false)

    const themes = ref<Record<string, MapTheme>>({ ...MAP_THEMES })
    const currentTheme = computed(() => themes.value[currentThemeId.value] || themes.value.classic)

    const toggleCountry = (id: string) => {
        const index = visited.value.indexOf(id)
        if (index > -1) visited.value.splice(index, 1)
        else visited.value.push(id)
    }

    const setTheme = (themeId: string) => {
        if (themes.value[themeId]) {
            currentThemeId.value = themeId
        }
    }

    const resetVisited = () => {
        visited.value = []
    }

    return {
        visited,
        currentTheme,
        themes,
        pendingCountryId,
        showLabels,
        setTheme,
        toggleCountry,
        resetVisited
    }
}, {
    persist: true // Авто-сохранение включено
})