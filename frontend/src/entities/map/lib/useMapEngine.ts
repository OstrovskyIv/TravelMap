import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MapRenderer } from '@shared/lib/map-engine/MapRenderer'
import { ALL_COUNTRIES } from '@entities/country/model'
import { useMapStore } from '@entities/map/model/mapStore'
import { useUiStore } from '@shared/lib/uiStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'

export function useMapEngine() {
    const mapStore = useMapStore()
    const uiStore = useUiStore()
    const langStore = useLangStore()

    const mapContainer = ref<HTMLElement | null>(null)
    const isLoading = ref(false)
    const mousePos = ref({ x: 0, y: 0 })
    const hoveredCountryName = ref<string | null>(null)

    const handleGlobalMouseMove = (e: MouseEvent) => {
        mousePos.value = { x: e.clientX, y: e.clientY }
    }

    const draw = async () => {
        if (!mapContainer.value || !mapStore.currentTheme) return
        if (mapStore.mapFeatures.length === 0) await mapStore.loadMapData()

        MapRenderer.renderMap({
            container: mapContainer.value,
            features: mapStore.mapFeatures,
            theme: mapStore.currentTheme,
            unlockedCountries: mapStore.unlockedCountries,
            pendingId: mapStore.pendingCountryId,
            visitedCities: mapStore.visitedCities,
            showLabels: mapStore.showLabels,
            onCountryClick: (id) => {
                if (mapStore.isRouteMode) {
                    mapStore.addRoutePoint(id)
                    MapRenderer.drawRoute(mapStore.routePoints, mapStore.mapFeatures, mapStore.currentTheme!)
                    return
                }

                mapStore.pendingCountryId = id
                if (mapStore.isUnlocked(id)) uiStore.setInfoModal(true)
                else uiStore.setCountryModal(true)

                MapRenderer.flyTo(id, mapStore.currentTheme!)
            },
            onCountryHover: (feature) => {
                if (!feature || !mapStore.showLabels) {
                    hoveredCountryName.value = null
                    return
                }
                const id = feature.properties.ISO_A3 || feature.properties.iso_a3
                const country = ALL_COUNTRIES.find(c => c.id === id)
                hoveredCountryName.value = country ? country.names[langStore.currentLang] : (id as string)
            }
        })

        if (mapStore.routePoints.length > 0) {
            MapRenderer.drawRoute(mapStore.routePoints, mapStore.mapFeatures, mapStore.currentTheme!)
        }
    }

    watch(() => mapStore.showLabels, (val) => MapRenderer.toggleLabels(val))

    onMounted(draw)
    onUnmounted(() => window.removeEventListener('resize', draw))

    return { mapContainer, isLoading, mousePos, hoveredCountryName, handleGlobalMouseMove, draw }
}