import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { LocalStorage } from '@/utils/LocalStorage'

export const useMapStore = defineStore('map', () => {
    // Загружаем из нашего LocalStorage
    const visited = ref<string[]>(LocalStorage.load<string[]>('visited') || [])

    const toggleCountry = (id: string) => {
        const index = visited.value.indexOf(id)
        if (index > -1) {
            visited.value.splice(index, 1)
        } else {
            visited.value.push(id)
        }
    }

    // Следим за изменениями и сохраняем
    watch(visited, (newVal) => {
        LocalStorage.save('visited', newVal)
    }, { deep: true })

    return { visited, toggleCountry }
})