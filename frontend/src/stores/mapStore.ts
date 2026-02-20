import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { LocalStorage } from '@/shared/lib/LocalStorage'
import { MAP_THEMES, type MapTheme } from '@/shared/map-themes'

export const useMapStore = defineStore('map', () => {
    const visited = ref<string[]>(LocalStorage.load<string[]>('visited') || [])
    const currentThemeId = ref<string>(LocalStorage.load<string>('theme_id') || 'classic')
    const pendingCountryId = ref<string | null>(null)

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
            LocalStorage.save('theme_id', themeId)
        }
    }

    const resetVisited = () => {
        visited.value = []
        LocalStorage.save('visited', [])
    }

    watch(visited, (newVal) => LocalStorage.save('visited', newVal), { deep: true })

    return {
        visited,
        currentTheme,
        themes,
        pendingCountryId,
        setTheme,
        toggleCountry,
        resetVisited
    }
})