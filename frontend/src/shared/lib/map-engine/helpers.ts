import * as d3 from 'd3'
import { ALL_COUNTRIES } from '@entities/country/model'
import type { MapTheme } from '@entities/map/model/types'

export const MapHelpers = {
    getColor(id: string, unlocked: string[], pendingId: string | null, visitedCities: Record<string, string[]>, theme: MapTheme): string {
        // 1. Если на страну нажали прямо сейчас - ЗОЛОТАЯ
        if (id === pendingId) return theme.colors.map.selectedFill

        // 2. Если страна разблокирована
        if (unlocked.includes(id)) {
            const country = ALL_COUNTRIES.find(c => c.id === id)
            if (!country) return theme.colors.map.unlockedFill
            const vCount = visitedCities[id]?.length || 0
            if (vCount === 0) return theme.colors.map.unlockedFill // Чисто красный

            const progress = vCount / country.cities.length
            return progress === 1 ? '#22c55e' : d3.interpolateRgbBasis(['#ef4444', '#fbbf24', '#22c55e'])(progress)
        }

        // 3. Иначе - СЕРАЯ (Заблокирована)
        return theme.colors.map.unvisited[0] || '#1a1a1c'
    }
}