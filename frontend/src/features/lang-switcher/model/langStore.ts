import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { languages, type LanguageCode, type LanguageTree } from '@shared/lib/languages'

export const useLangStore = defineStore('lang', () => {
    const currentLang = ref<LanguageCode>('ru')

    const t = computed<LanguageTree>(() => languages[currentLang.value] as unknown as LanguageTree)

    const setLang = (lang: LanguageCode) => {
        currentLang.value = lang
    }

    return { currentLang, t, setLang }
}, { persist: true })