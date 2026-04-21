import type { CountryData } from './types'

const modules = import.meta.glob<CountryData>('../data/*.ts', { eager: true, import: 'default' })

export const ALL_COUNTRIES: CountryData[] = Object.values(modules)

export * from './types'