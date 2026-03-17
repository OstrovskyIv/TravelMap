import { defineStore } from 'pinia'
import { ref } from 'vue' // Удалили watch

export const useLangStore = defineStore('lang', () => {
    const currentLang = ref(localStorage.getItem('lang') || 'ru')

    const setLang = (lang: string) => {
        currentLang.value = lang
        localStorage.setItem('lang', lang)
    }

    return {
        currentLang,
        setLang
    }
})