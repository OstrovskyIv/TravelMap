import { ref, onMounted, onUnmounted, watch } from 'vue'
import { MapRenderer } from '@shared/lib/MapRenderer'

export function useMapEngine() {
    const mapStore = useMapStore()
    const uiStore = useUiStore()

    const draw = async () => {
        if (!mapContainer.value || !mapStore.currentTheme) return
        if (mapStore.mapFeatures.length === 0) await mapStore.loadMapData()

        MapRenderer.renderMap({
            container: mapContainer.value,
            features: mapStore.mapFeatures,
            theme: mapStore.currentTheme,
            visited: mapStore.visited,
            onCountryClick: (id) => {
                if (!mapStore.currentTheme) return
                mapStore.pendingCountryId = id
                if (mapStore.visited.includes(id)) uiStore.setInfoModal(true)
                else uiStore.setCountryModal(true)
            },
            onCountryHover: () => {}
        })
    }

    const mapContainer = ref<HTMLElement | null>(null)
    const isLoading = ref(false)

    onMounted(draw)
    onUnmounted(() => {
        window.removeEventListener('resize', draw)
    })

    return { mapContainer, isLoading }
}