export interface City {
    id: string
    names: { ru: string; en: string }
    coords: { lat: number; lng: number }
    isCapital?: boolean
}

export interface CountryData {
    id: string
    flag: string
    names: { ru: string; en: string }
    description: { ru: string; en: string }
    stats: {
        population: string
        area: string
        currency: string
    }
    keywords: string[]
    cities: City[]
}