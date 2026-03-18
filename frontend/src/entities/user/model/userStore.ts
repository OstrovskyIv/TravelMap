import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const balance = ref(0)
    const purchasedThemes = ref(['classic'])
    const isAdmin = ref(true)
    const userName = ref('Ivan Admin')

    // Добавление/вычитание баланса
    const addBalance = (amount: number) => {
        balance.value = Math.max(0, balance.value + amount)
    }

    // Покупка темы (с проверкой баланса)
    const buyTheme = (themeId: string, price: number): boolean => {
        if (balance.value >= price && !purchasedThemes.value.includes(themeId)) {
            balance.value -= price
            purchasedThemes.value.push(themeId)
            return true
        }
        return false
    }

    // Забрать доступ к теме
    const lockTheme = (themeId: string) => {
        if (themeId === 'classic') return // Классическую нельзя забрать
        purchasedThemes.value = purchasedThemes.value.filter(id => id !== themeId)
    }

    // Выдать доступ к теме
    const unlockTheme = (themeId: string) => {
        if (!purchasedThemes.value.includes(themeId)) {
            purchasedThemes.value.push(themeId)
        }
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
    persist: true
})