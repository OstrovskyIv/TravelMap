import { defineStore } from 'pinia'
import { ref } from 'vue'
import { MapRenderer } from '@shared/lib/map-engine/MapRenderer'

export const useUiStore = defineStore('ui', () => {
    const isSidebarOpen = ref(true)
    const isAdminConsoleOpen = ref(false)
    const isCountryModalOpen = ref(false)
    const isInfoModalOpen = ref(false)
    const isVipModalOpen = ref(false)
    const isGamesModalOpen = ref(false)

    const showMapTools = ref(true)
    const isHintsActive = ref(false)

    const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value }
    const toggleAdminConsole = () => { isAdminConsoleOpen.value = !isAdminConsoleOpen.value }
    const setVipModal = (val: boolean) => { isVipModalOpen.value = val }
    const setGamesModal = (val: boolean) => { isGamesModalOpen.value = val }
    const setCountryModal = (val: boolean) => { isCountryModalOpen.value = val }
    const setInfoModal = (val: boolean) => { isInfoModalOpen.value = val }

    const closeAllModals = () => {
        const mapStore = useMapStore()
        isCountryModalOpen.value = false
        isInfoModalOpen.value = false
        isVipModalOpen.value = false
        isGamesModalOpen.value = false

        if (mapStore.currentTheme) {
            MapRenderer.highlightCountry(null, mapStore.currentTheme)
            MapRenderer.resetView()
        }
        mapStore.pendingCountryId = null
    }

    return {
        isSidebarOpen, isAdminConsoleOpen, isCountryModalOpen, isInfoModalOpen, isVipModalOpen, isGamesModalOpen,
        showMapTools, isHintsActive,
        toggleSidebar, toggleAdminConsole, setCountryModal, setInfoModal, setVipModal, setGamesModal, closeAllModals
    }
}, { persist: true })