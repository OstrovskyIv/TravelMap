import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@entities/country/model'
import type { MapTheme } from '@entities/map/model/types'

export const MapHelpers = {
    getColor(id: string, unlocked: string[], pendingId: string | null, visitedCities: Record<string, string[]>, theme: MapTheme): string {
        if (id === pendingId) return theme.colors.map.selectedFill

        if (unlocked.includes(id)) {
            const country = ALL_COUNTRIES.find(c => c.id === id)
            if (!country) return theme.colors.map.unlockedFill

            const vCount = visitedCities[id]?.length || 0
            const totalCities = country.cities.length

            if (vCount === 0) return '#ef4444'

            const progress = vCount / totalCities

            const colorScale = d3.interpolateRgbBasis([
                '#ef4444',
                '#f97316',
                '#f59e0b',
                '#fbbf24',
                '#facc15',
                '#a3e635',
                '#4ade80',
                '#22c55e'
            ])

            return colorScale(progress)
        }

        return theme.colors.map.unvisited[0] || '#1a1a1c'
    },

    calculateDistance(coords1: [number, number], coords2: [number, number]): number {
        const R = 6371
        const dLat = (coords2[1] - coords1[1]) * Math.PI / 180
        const dLon = (coords2[0] - coords1[0]) * Math.PI / 180
        const a =
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(coords1[1] * Math.PI / 180) * Math.cos(coords2[1] * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
        return Math.round(R * c)
    }
}