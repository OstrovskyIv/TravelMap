import { defineStore } from 'pinia'
import { ref, computed, shallowRef } from 'vue'
import { MAP_THEMES, type MapTheme } from '@entities/map/model'
import { MapHelpers } from '@shared/lib/map-engine/helpers'

export interface ChatMessage { id: string; author: string; text: string; timestamp: number }
export interface Album { id: string; name: string; images: string[]; timestamp: number }
export interface Ratings { interest: number; cleanliness: number; friendliness: number; difficulty: number }

export const useMapStore = defineStore('map', () => {
    const visited = ref<string[]>([])
    const unlockedCountries = ref<string[]>([])
    const visitedCities = ref<Record<string, string[]>>({})
    const currentThemeId = ref<string>('atlas')
    const zoomLevel = ref(1)
    const showLabels = ref(false)
    const showCursorLabel = ref(true)
    const mapFeatures = shallowRef<any[]>([])
    const isDataLoading = ref(false)
    const pendingCountryId = ref<string | null>(null)
    const isRouteMode = ref(false)
    const routePoints = ref<string[]>([])

    const countryRatings = ref<Record<string, Ratings>>({})
    const cityRatings = ref<Record<string, number>>({})
    const publicChats = ref<Record<string, ChatMessage[]>>({})
    const personalAlbums = ref<Record<string, Album[]>>({})

    const themes = ref<Record<string, MapTheme>>({ ...MAP_THEMES })
    const currentTheme = computed(() => themes.value[currentThemeId.value] || themes.value.atlas)

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

    const isUnlocked = (id: string) => unlockedCountries.value.includes(id)
    const isCityVisited = (countryId: string, cityId: string) => visitedCities.value[countryId]?.includes(cityId) || false

    const toggleCityVisit = (countryId: string, cityId: string) => {
        if (!visitedCities.value[countryId]) visitedCities.value[countryId] = []
        const index = visitedCities.value[countryId].indexOf(cityId)
        if (index > -1) visitedCities.value[countryId].splice(index, 1)
        else visitedCities.value[countryId].push(cityId)
    }

    const getCityRating = (cityId: string) => cityRatings.value[cityId] || 0

    const getCountryScore = (countryId: string, citiesIds: string[]) => {
        const r = countryRatings.value[countryId] || { interest: 0, cleanliness: 0, friendliness: 0, difficulty: 0 }
        const sum = (r.interest || 0) + (r.cleanliness || 0) + (r.friendliness || 0) + (r.difficulty || 0)
        const weightedBase = (sum / 4) * 0.9
        let cityAvg = 0
        if (citiesIds.length > 0) {
            const cSum = citiesIds.reduce((acc, cid) => acc + (cityRatings.value[cid] || 0), 0)
            cityAvg = (cSum / citiesIds.length) / 10
        }
        const res = weightedBase + cityAvg
        return isNaN(res) ? 0 : parseFloat(res.toFixed(1))
    }

    const addChatMessage = (id: string, msg: ChatMessage) => {
        if (!publicChats.value[id]) publicChats.value[id] = []
        publicChats.value[id].push(msg)
    }

    const addAlbum = (id: string, album: Album) => {
        if (!personalAlbums.value[id]) personalAlbums.value[id] = []
        personalAlbums.value[id].unshift(album)
    }

    const setCountryRating = (id: string, r: Ratings) => { countryRatings.value[id] = r }
    const setCityRating = (id: string, s: number) => { cityRatings.value[id] = s }
    const addRoutePoint = (id: string) => { routePoints.value.push(id) }
    const removeLastPoint = () => { if (routePoints.value.length > 0) routePoints.value.pop() }
    const clearRoute = () => { routePoints.value = [] }
    const setZoom = (v: number) => { zoomLevel.value = Math.max(1, Math.min(15, v)) }
    const setTheme = (id: string) => { if (themes.value[id]) currentThemeId.value = id }

    const unlockCountry = (id: string) => {
        if (!unlockedCountries.value.includes(id)) {
            unlockedCountries.value.push(id)
            if (!visitedCities.value[id]) visitedCities.value[id] = []
        }
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

    return {
        visited, unlockedCountries, visitedCities, currentThemeId, currentTheme, themes, zoomLevel,
        pendingCountryId, showLabels, showCursorLabel, mapFeatures, isDataLoading, isRouteMode, routePoints,
        countryRatings, cityRatings, publicChats, personalAlbums, totalDistance,
        loadMapData, setZoom, setTheme, unlockCountry, isUnlocked, addRoutePoint, removeLastPoint, clearRoute,
        getCountryScore, toggleCityVisit, isCityVisited, addChatMessage, addAlbum, setCountryRating, setCityRating, getCityRating
    }
}, {
    persist: true
})