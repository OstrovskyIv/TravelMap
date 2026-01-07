import { defineStore } from 'pinia'
import { ref, watch, computed } from 'vue'
import { LocalStorage } from '@/shared/lib/LocalStorage'
import { MAP_THEMES } from '@/shared/map-themes'

export const useMapStore = defineStore('map', () => {
    const visited = ref<string[]>(LocalStorage.load<string[]>('visited') || [])
    const currentThemeId = ref<string>(LocalStorage.load<string>('theme_id') || 'classic')

    const currentTheme = computed(() => MAP_THEMES[currentThemeId.value] || MAP_THEMES.classic)

    const toggleCountry = (id: string) => {
        const index = visited.value.indexOf(id)
        if (index > -1) {
            visited.value.splice(index, 1)
        } else {
            visited.value.push(id)
        }
    }

    const setTheme = (themeId: string) => {
        if (MAP_THEMES[themeId]) {
            currentThemeId.value = themeId
            LocalStorage.save('theme_id', themeId)
        }
    }

    watch(
        visited,
        (newVal) => {
            LocalStorage.save('visited', newVal)
        },
        { deep: true }
    )
    return { visited, toggleCountry, currentTheme, setTheme }
})