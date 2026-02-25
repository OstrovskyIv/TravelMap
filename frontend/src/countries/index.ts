export interface City {
    id: string
    names: {
        ru: string
        en: string
    }
    coords: {
        lat: number
        lng: number
    }
    isCapital?: boolean
}

export interface CountryData {
    id: string
    names: {
        ru: string
        en: string
    }
    description: {
        ru: string
        en: string
    }
    stats: {
        population: string
        area: string
        currency: string
    }
    keywords: string[]
    cities: City[]
}

const modules = import.meta.glob<CountryData>('./*.ts', { eager: true, import: 'default' })

export const ALL_COUNTRIES: CountryData[] = Object.values(modules).filter((m): m is CountryData =>
    Boolean(m && m.id)
)

export const findCountry = (query: string): CountryData | undefined => {
    const q = query.toLowerCase().trim()
    return ALL_COUNTRIES.find(c =>
        c.id.toLowerCase() === q ||
        c.names.ru.toLowerCase().includes(q) ||
        c.names.en.toLowerCase().includes(q) ||
        c.keywords.some(k => k.toLowerCase().includes(q))
    )
}