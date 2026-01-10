import { defineStore } from 'pinia'
import { ref } from 'vue' // Убрали watch
import { LocalStorage } from '@/shared/lib/LocalStorage'

export type Language = 'ru' | 'en'

export const useLangStore = defineStore('lang', () => {
    const currentLang = ref<Language>(LocalStorage.load<Language>('app_lang') || 'ru')

    const setLang = (lang: Language) => {
        currentLang.value = lang
        LocalStorage.save('app_lang', lang)
    }

    return {
        currentLang,
        setLang
    }
})