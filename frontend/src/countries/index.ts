const modules = import.meta.glob('./*.ts', { eager: true, import: 'default' })

export interface CountryData {
    id: string
    name: string
    keywords: string[]
    cities: string[]
    geoUrl: string
}

export const ALL_COUNTRIES = Object.values(modules) as CountryData[]

export const findCountry = (query: string): CountryData | undefined => {
    const q = query.toLowerCase().trim()
    return ALL_COUNTRIES.find(c =>
        c.id.toLowerCase() === q ||
        c.name.toLowerCase().includes(q) ||
        c.keywords.includes(q)
    )
}