import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLangStore = defineStore('lang', () => {
    const currentLang = ref('ru')
    const setLang = (lang: string) => { currentLang.value = lang }
    return { currentLang, setLang }
}, { persist: true })