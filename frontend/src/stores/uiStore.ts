import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
    const isSidebarOpen = ref(true)
    const isAdminConsoleOpen = ref(false)

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value
    }

    const toggleAdminConsole = () => {
        isAdminConsoleOpen.value = !isAdminConsoleOpen.value
    }

    return {
        isSidebarOpen,
        isAdminConsoleOpen,
        toggleSidebar,
        toggleAdminConsole
    }
})