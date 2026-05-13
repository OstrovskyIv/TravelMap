import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@shared/api/index'

export const useUserStore = defineStore('user', () => {
    const user = ref<any>(null)
    const token = ref<string | null>(localStorage.getItem('auth_token'))
    const isAuthLoading = ref(false)

    const setAuth = (userData: any, userToken: string) => {
        user.value = userData
        if (!user.value.inventory) user.value.inventory = []
        token.value = userToken
        localStorage.setItem('auth_token', userToken)
    }

    const logout = () => {
        user.value = null; token.value = null;
        localStorage.removeItem('auth_token')
    }

    const fetchProfile = async () => {
        if (!token.value) return
        try {
            const { data } = await api.get('/users/me')
            user.value = data.user
            // Если бэкенд возвращает инвентарь отдельно, склеиваем
            if (data.inventory) user.value.inventory = data.inventory
        } catch (err) {
            console.error(err)
        }
    }

    const addBalance = async (amount: number) => {
        try {
            const { data } = await api.post('/economy/reward', { amount })
            if (user.value) user.value.balance = data.balance
        } catch (err) {
            console.error('Balance sync error', err)
        }
    }

    const login = async (credentials: any) => {
        isAuthLoading.value = true
        try {
            const { data } = await api.post('/auth/login', credentials)
            setAuth(data.user, data.token)
            await fetchProfile()
            return { success: true }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Login failed' }
        } finally {
            isAuthLoading.value = false
        }
    }

    const register = async (credentials: any) => {
        isAuthLoading.value = true
        try {
            const { data } = await api.post('/auth/register', credentials)
            return { success: true, message: data.message }
        } catch (err: any) {
            return { success: false, message: err.response?.data?.message || 'Error' }
        } finally {
            isAuthLoading.value = false
        }
    }

    // Геттеры для инвентаря
    const purchasedThemes = computed(() => user.value?.inventory?.filter((i: any) => i.item_type === 'themes').map((i: any) => i.item_id) || [])
    const purchasedEmojis = computed(() => user.value?.inventory?.filter((i: any) => i.item_type === 'profile').map((i: any) => i.item_id) || [])
    const purchasedHats = computed(() => user.value?.inventory?.filter((i: any) => i.item_type === 'hats').map((i: any) => i.item_id) || [])

    const balance = computed(() => user.value?.balance || 0)
    const isAdmin = computed(() => user.value?.is_admin || false)
    const isVip = computed(() => user.value?.is_vip || false)
    const userName = computed(() => user.value?.username || 'Guest')
    const activeEmoji = computed(() => user.value?.active_emoji || null)
    const activeHat = computed(() => user.value?.active_hat || null)

    return {
        user, token, isAuthLoading, balance, isAdmin, isVip, userName, activeEmoji, activeHat,
        purchasedThemes, purchasedEmojis, purchasedHats,
        login, register, logout, fetchProfile, addBalance
    }
}, { persist: true })