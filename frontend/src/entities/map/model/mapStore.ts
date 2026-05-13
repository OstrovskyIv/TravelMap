import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { MAP_THEMES, type MapTheme } from '@entities/map/model'
import { MapHelpers } from '@shared/lib/map-engine/helpers'
import api from '@shared/api/index'

export const useMapStore = defineStore('map', () => {
    // Данные прогресса
    const unlockedCountries = ref<string[]>([])
    const visitedCities = ref<Record<string, string[]>>({})
    const countryRatings = ref<Record<string, any>>({})

    // UI Состояние
    const currentThemeId = ref<string>('classic')
    const zoomLevel = ref(1)
    const showLabels = ref(false)
    const showCursorLabel = ref(true)
    const mapFeatures = shallowRef<any[]>([])
    const isDataLoading = ref(false)
    const pendingCountryId = ref<string | null>(null)
    const isRouteMode = ref(false)
    const routePoints = ref<string[]>([])

    const themes = ref<Record<string, MapTheme>>({ ...MAP_THEMES })
    const currentTheme = computed(() => themes.value[currentThemeId.value] || themes.value.classic)

    // --- СИНХРОНИЗАЦИЯ С БЭКЕНДОМ ---

    const fetchProgress = async () => {
        try {
            const { data } = await api.get('/map/progress')
            unlockedCountries.value = data.unlockedCountries || []

            // Преобразуем массив городов в объект для удобства
            const citiesObj: Record<string, string[]> = {}
            data.visitedCities?.forEach((item: any) => {
                if (!citiesObj[item.country_id]) citiesObj[item.country_id] = []
                citiesObj[item.country_id].push(item.city_id)
            })
            visitedCities.value = citiesObj

            // Преобразуем рейтинги
            const ratingsObj: Record<string, any> = {}
            data.ratings?.forEach((item: any) => {
                ratingsObj[item.country_id] = {
                    interest: item.interest,
                    cleanliness: item.cleanliness,
                    friendliness: item.friendliness,
                    difficulty: item.difficulty
                }
            })
            countryRatings.value = ratingsObj
        } catch (err) {
            console.error('Failed to sync map progress:', err)
        }
    }

    const unlockCountry = async (id: string) => {
        if (unlockedCountries.value.includes(id)) return
        try {
            await api.post('/map/unlock', { countryId: id })
            unlockedCountries.value.push(id)
            if (!visitedCities.value[id]) visitedCities.value[id] = []
        } catch (err) {
            console.error('Unlock sync failed:', err)
        }
    }

    const toggleCityVisit = async (countryId: string, cityId: string) => {
        try {
            await api.post('/map/city', { countryId, cityId })
            if (!visitedCities.value[countryId]) visitedCities.value[countryId] = []

            const index = visitedCities.value[countryId].indexOf(cityId)
            if (index > -1) visitedCities.value[countryId].splice(index, 1)
            else visitedCities.value[countryId].push(cityId)
        } catch (err) {
            console.error('City toggle sync failed:', err)
        }
    }

    const saveCountryRating = async (countryId: string, ratings: any) => {
        try {
            await api.post('/map/rating', { countryId, ...ratings })
            countryRatings.value[countryId] = ratings
        } catch (err) {
            console.error('Rating sync failed:', err)
        }
    }

    // --- ОСТАЛЬНАЯ ЛОГИКА (БЕЗ ИЗМЕНЕНИЙ) ---

    const loadMapData = async () => {
        if (mapFeatures.value.length > 0) return
        isDataLoading.value = true
        try {
            const d3 = await import('d3')
            const worldData = await d3.json(`${import.meta.env.BASE_URL}data/custom.geo.json`) as any
            mapFeatures.value = worldData.features
        } catch (e) { console.error(e) } finally { isDataLoading.value = false }
    }

    const totalDistance = computed(() => {
        if (routePoints.value.length < 2) return 0
        let dist = 0
        for (let i = 0; i < routePoints.value.length - 1; i++) {
            const f1 = mapFeatures.value.find(f => (f.properties.ISO_A3 || f.properties.iso_a3) === routePoints.value[i])
            const f2 = mapFeatures.value.find(f => (f.properties.ISO_A3 || f.properties.iso_a3) === routePoints.value[i+1])
            if (f1?.properties.centroid && f2?.properties.centroid) {
                dist += MapHelpers.calculateDistance(f1.properties.centroid, f2.properties.centroid)
            }
        }
        return dist
    })

    return {
        unlockedCountries, visitedCities, currentThemeId, currentTheme, themes, zoomLevel,
        pendingCountryId, showLabels, showCursorLabel, mapFeatures, isDataLoading, isRouteMode, routePoints,
        countryRatings, totalDistance,
        loadMapData, fetchProgress, unlockCountry, toggleCityVisit, saveCountryRating,
        setZoom: (v: number) => { zoomLevel.value = v },
        setTheme: (id: string) => { if (themes.value[id]) currentThemeId.value = id },
        isUnlocked: (id: string) => unlockedCountries.value.includes(id),
        addRoutePoint: (id: string) => { routePoints.value.push(id) },
        removeLastPoint: () => routePoints.value.pop(),
        clearRoute: () => { routePoints.value = [] }
    }
}, { persist: true })