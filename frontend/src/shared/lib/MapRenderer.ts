import * as d3 from 'd3'
import type { MapTheme } from '@/shared/map-themes/types'

// Интерфейс для данных страны из GeoJSON
interface CountryFeature {
    properties: {
        ISO_A3?: string
        iso_a3?: string
        name?: string
        [key: string]: unknown
    }
}

export const MapRenderer = {
    getWoodColor(iso: string, isVisited: boolean, theme: MapTheme): string {
        const palette = isVisited ? theme.colors.visited : theme.colors.unvisited
        const colors = Array.isArray(palette) ? palette : [palette]
        const charSum = iso.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return (colors[charSum % colors.length] ?? colors[0]) as string
    },

    setupDefinitions(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
        const defs = svg.append('defs')

        const grain = defs.append('filter').attr('id', 'wood-grain-filter')
        grain.append('feTurbulence')
            .attr('type', 'fractalNoise')
            .attr('baseFrequency', '0.02 0.4')
            .attr('numOctaves', '3')

        grain.append('feComposite')
            .attr('in', 'SourceGraphic')
            .attr('operator', 'arithmetic')
            .attr('k1', '0.2')
            .attr('k2', '0.9')

        const shadow = defs.append('filter').attr('id', 'soft-shadow').attr('height', '150%')
        shadow.append('feDropShadow')
            .attr('dx', '1.5')
            .attr('dy', '3.5')
            .attr('stdDeviation', '2.5')
            .attr('flood-color', '#261910')
            .attr('flood-opacity', '0.45')
    },

    applyStyles(
        svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
        theme: MapTheme,
        visited: string[]
    ): void {
        const isWooden = theme.id === 'wooden'

        // Явно указываем типы для selectAll: <Элемент, Данные>
        svg.selectAll<SVGPathElement, CountryFeature>('.country-side')
            .transition()
            .duration(800)
            .attr('opacity', theme.is3D ? 1 : 0)
            .attr('fill', (d) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3 || ''
                const base = this.getWoodColor(id, visited.includes(id), theme)
                return d3.color(base)?.darker(1.5).toString() || '#000'
            })

        svg.selectAll<SVGPathElement, CountryFeature>('.country-top')
            .transition()
            .duration(800)
            .attr('fill', (d) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3 || ''
                const isVisited = visited.includes(id)

                if (isWooden) {
                    return this.getWoodColor(id, isVisited, theme)
                }

                return (isVisited ? (theme.colors.visited as string) : (theme.colors.unvisited as string))
            })
            .attr('stroke', theme.colors.border || '#000')
            .attr('stroke-width', theme.strokeWidth)
            .attr('filter', theme.hasGrain ? 'url(#wood-grain-filter) url(#soft-shadow)' : (theme.is3D ? 'url(#soft-shadow)' : null))
    }
}