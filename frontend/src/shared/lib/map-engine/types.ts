import * as d3 from 'd3'
import type { MapTheme } from '@entities/map/model/types'

export interface CountryProperties {
    ISO_A3?: string;
    iso_a3?: string;
    centroid?: [number, number];
}

export type CountryFeature = d3.ExtendedFeature<d3.GeoGeometryObjects | null, CountryProperties>

export interface RenderOptions {
    container: HTMLElement
    features: CountryFeature[]
    theme: MapTheme
    unlockedCountries: string[]
    pendingId: string | null
    visitedCities: Record<string, string[]>
    showLabels: boolean
    onCountryClick: (id: string) => void
    onCountryHover: (feature: CountryFeature | null) => void
}