import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
    const isSidebarOpen = ref(true)

    const toggleSidebar = () => {
        isSidebarOpen.value = !isSidebarOpen.value
    }

    return { isSidebarOpen, toggleSidebar }
})