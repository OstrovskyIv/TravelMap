import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const balance = ref<number>(0)
    const purchasedThemes = ref<string[]>(['classic'])
    const isAdmin = ref(true)
    const userName = ref('Ivan Admin')

    const addBalance = (amount: number) => {
        const nextBalance = balance.value + amount
        balance.value = nextBalance < 0 ? 0 : nextBalance
    }

    const lockTheme = (themeId: string) => {
        if (themeId === 'classic') return
        purchasedThemes.value = purchasedThemes.value.filter(id => id !== themeId)
    }

    const unlockTheme = (themeId: string) => {
        if (!purchasedThemes.value.includes(themeId)) {
            purchasedThemes.value = [...purchasedThemes.value, themeId]
        }
    }

    const buyTheme = (themeId: string, price: number): boolean => {
        const currentPrice = Number(price) || 0
        if (balance.value >= currentPrice && !purchasedThemes.value.includes(themeId)) {
            balance.value -= currentPrice
            purchasedThemes.value = [...purchasedThemes.value, themeId]
            return true
        }
        return false
    }

    return {
        balance,
        purchasedThemes,
        isAdmin,
        userName,
        addBalance,
        buyTheme,
        lockTheme,
        unlockTheme
    }
}, {
    persist: true // Авто-сохранение включено
})