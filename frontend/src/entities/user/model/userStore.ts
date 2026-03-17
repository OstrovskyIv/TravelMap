import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const balance = ref(0)
    const purchasedThemes = ref(['classic'])
    const isAdmin = ref(true)
    const userName = ref('Ivan Admin')

    const addBalance = (amount: number) => { balance.value = Math.max(0, balance.value + amount) }
    const buyTheme = (themeId: string, price: number) => {
        if (balance.value >= price && !purchasedThemes.value.includes(themeId)) {
            balance.value -= price
            purchasedThemes.value.push(themeId)
            return true
        }
        return false
    }
    return { balance, purchasedThemes, isAdmin, userName, addBalance, buyTheme }
}, { persist: true })