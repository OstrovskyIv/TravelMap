import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    // В будущем здесь будет логика авторизации
    const isAdmin = ref(true)
    const userName = ref('Ivan Admin')

    return {
        isAdmin,
        userName
    }
})