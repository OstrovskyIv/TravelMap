import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { LocalStorage } from '@/shared/lib/LocalStorage'

export const useUserStore = defineStore('user', () => {
    const balance = ref<number>(LocalStorage.load<number>('user_balance') || 0)
    const purchasedThemes = ref<string[]>(LocalStorage.load<string[]>('purchased_themes') || ['classic'])
    const isAdmin = ref(true)
    const userName = ref('Ivan Admin')

    const addBalance = (amount: number) => {
        const nextBalance = balance.value + amount
        balance.value = nextBalance < 0 ? 0 : nextBalance
    }

    const buyTheme = (themeId: string, price: number): boolean => {
        if (balance.value >= price && !purchasedThemes.value.includes(themeId)) {
            balance.value -= price
            purchasedThemes.value.push(themeId)
            return true
        }
        return false
    }

    watch(balance, (val) => LocalStorage.save('user_balance', val))
    watch(purchasedThemes, (val) => LocalStorage.save('purchased_themes', val), { deep: true })

    return { balance, purchasedThemes, isAdmin, userName, addBalance, buyTheme }
})