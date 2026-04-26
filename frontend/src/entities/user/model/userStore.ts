import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const balance = ref(5000)
    const purchasedThemes = ref(['atlas'])
    const purchasedEmojis = ref<string[]>([])
    const purchasedHats = ref<string[]>([])
    const activeEmoji = ref<string | null>(null)
    const activeHat = ref<string | null>(null)
    const isAdmin = ref(true)
    const userName = ref('Ivan Admin')
    const isVip = ref(false)

    const addBalance = (amount: number) => {
        balance.value = Math.max(0, balance.value + amount)
    }

    const buyTheme = (themeId: string, price: number): boolean => {
        if (balance.value >= price && !purchasedThemes.value.includes(themeId)) {
            balance.value -= price
            purchasedThemes.value.push(themeId)
            return true
        }
        return false
    }

    const buyEmoji = (emoji: string, price: number): boolean => {
        if (balance.value >= price && !purchasedEmojis.value.includes(emoji)) {
            balance.value -= price
            purchasedEmojis.value.push(emoji)
            return true
        }
        return false
    }

    const buyHat = (hat: string, price: number): boolean => {
        if (balance.value >= price && !purchasedHats.value.includes(hat)) {
            balance.value -= price
            purchasedHats.value.push(hat)
            return true
        }
        return false
    }

    const buyVip = () => { isVip.value = true }

    return {
        balance, purchasedThemes, purchasedEmojis, purchasedHats, activeEmoji, activeHat, isAdmin, userName, isVip,
        addBalance, buyTheme, buyEmoji, buyHat, buyVip
    }
}, {
    persist: true
})