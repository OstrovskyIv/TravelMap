import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { MAP_THEMES, type MapTheme } from '@entities/map/model'
import { MapHelpers } from '@shared/lib/map-engine/helpers'
import api from '@shared/api/index'

export const useMapStore = defineStore('map', () => {
    const unlockedCountries = ref<string[]>([])
    const visitedCities = ref<Record<string, string[]>>({})
    const countryRatings = ref<Record<string, any>>({})
    const cityRatings = ref<Record<string, number>>({}) // Рейтинги городов
    const personalAlbums = ref<Record<string, any[]>>({}) // Альбомы

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


    const isUnlocked = (id: string) => unlockedCountries.value.includes(id)

    const isCityVisited = (countryId: string, cityId: string) => {
        return visitedCities.value[countryId]?.includes(cityId) || false
    }

    const getCityRating = (cityId: string) => cityRatings.value[cityId] || 0

    const getCountryScore = (countryId: string, citiesIds: string[]) => {
        const r = countryRatings.value[countryId] || { interest: 0, cleanliness: 0, friendliness: 0, difficulty: 0 }
        const sum = (r.interest || 0) + (r.cleanliness || 0) + (r.friendliness || 0) + (r.difficulty || 0)
        const weightedBase = (sum / 4) * 0.9
        let cityAvg = 0
        if (citiesIds.length > 0) {
            const visitedInCountry = visitedCities.value[countryId]?.length || 0
            cityAvg = (visitedInCountry / citiesIds.length) * 10
        }
        const res = (weightedBase + cityAvg) / 2
        return isNaN(res) ? 0 : parseFloat(res.toFixed(1))
    }


    const fetchProgress = async () => {
        try {
            const { data } = await api.get('/map/progress')
            unlockedCountries.value = data.unlockedCountries || []

            const citiesObj: Record<string, string[]> = {}
            data.visitedCities?.forEach((item: any) => {
                if (!citiesObj[item.country_id]) citiesObj[item.country_id] = []
                citiesObj[item.country_id].push(item.city_id)
            })
            visitedCities.value = citiesObj

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
        } catch (err) { console.error(err) }
    }

    const toggleCityVisit = async (countryId: string, cityId: string) => {
        try {
            await api.post('/map/city', { countryId, cityId })
            if (!visitedCities.value[countryId]) visitedCities.value[countryId] = []
            const index = visitedCities.value[countryId].indexOf(cityId)
            if (index > -1) visitedCities.value[countryId].splice(index, 1)
            else visitedCities.value[countryId].push(cityId)
        } catch (err) { console.error(err) }
    }

    const setCityRating = (cityId: string, score: number) => {
        cityRatings.value[cityId] = score
    }

    const saveCountryRating = async (countryId: string, ratings: any) => {
        try {
            await api.post('/map/rating', { countryId, ...ratings })
            countryRatings.value[countryId] = ratings
        } catch (err) { console.error(err) }
    }

    const addAlbum = (targetId: string, album: any) => {
        if (!personalAlbums.value[targetId]) personalAlbums.value[targetId] = []
        personalAlbums.value[targetId].unshift(album)
    }

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
        countryRatings, cityRatings, personalAlbums, totalDistance,
        loadMapData, fetchProgress, unlockCountry, toggleCityVisit, saveCountryRating,
        isUnlocked, isCityVisited, getCityRating, getCountryScore, setCityRating, addAlbum,
        setZoom: (v: number) => { zoomLevel.value = v },
        setTheme: (id: string) => { if (themes.value[id]) currentThemeId.value = id },
        addRoutePoint: (id: string) => { routePoints.value.push(id) },
        removeLastPoint: () => routePoints.value.pop(),
        clearRoute: () => { routePoints.value = [] }
    }
}, { persist: true })