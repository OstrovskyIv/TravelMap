import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {

    const isSidebarOpen = ref(true)
    const isAdminConsoleOpen = ref(false)
    const isCountryModalOpen = ref(false)
    const isInfoModalOpen = ref(false)


    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value
    }

    const toggleAdminConsole = () => {
        isAdminConsoleOpen.value = !isAdminConsoleOpen.value
    }


    const setCountryModal = (val: boolean) => {
        isCountryModalOpen.value = val
    }

    const setInfoModal = (val: boolean) => {
        isInfoModalOpen.value = val
    }

    return {
        isSidebarOpen,
        isAdminConsoleOpen,
        isCountryModalOpen,
        isInfoModalOpen,
        toggleSidebar,
        toggleAdminConsole,
        setCountryModal,
        setInfoModal
    }
})