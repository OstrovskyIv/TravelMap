import { ALL_COUNTRIES } from './index'
import type { CountryData } from './types'

export const useCountries = () => {
    const findCountry = (query: string): CountryData | undefined => {
        const q = query.toLowerCase().trim()
        return ALL_COUNTRIES.find(c =>
            c.id.toLowerCase() === q ||
            c.names.ru.toLowerCase().includes(q) ||
            c.names.en.toLowerCase().includes(q) ||
            c.keywords.some(k => k.toLowerCase().includes(q))
        )
    }

    const getCountryById = (id: string | null): CountryData | undefined => {
        if (!id) return undefined
        return ALL_COUNTRIES.find(c => c.id === id)
    }

    return {
        ALL_COUNTRIES,
        findCountry,
        getCountryById
    }
}