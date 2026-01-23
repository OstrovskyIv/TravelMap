import * as d3 from 'd3'
import type { MapTheme } from '@/shared/map-themes/types'

interface CountryFeature {
    properties: {
        ISO_A3?: string
        iso_a3?: string
        name?: string
        [key: string]: unknown
    }
}

export const MapRenderer = {
    getDynamicColor(iso: string, isVisited: boolean, theme: MapTheme): string {
        const palette = isVisited ? theme.colors.map.visited : theme.colors.map.unvisited
        if (theme.id === 'wooden') {
            const charSum = iso.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
            return (palette[charSum % palette.length] as string) || (palette[0] as string)
        }
        return (palette[0] as string) || '#333'
    },

    setupDefinitions(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>): void {
        const defs = svg.append('defs')
        const grain = defs.append('filter').attr('id', 'wood-grain-filter')
        grain.append('feTurbulence').attr('type', 'fractalNoise').attr('baseFrequency', '0.02 0.4').attr('numOctaves', '3')
        grain.append('feComposite').attr('in', 'SourceGraphic').attr('operator', 'arithmetic').attr('k1', '0.2').attr('k2', '0.9')

        const shadow = defs.append('filter').attr('id', 'soft-shadow').attr('height', '150%')
        shadow.append('feDropShadow').attr('dx', '1.5').attr('dy', '3.5').attr('stdDeviation', '2.5').attr('flood-color', '#000').attr('flood-opacity', '0.45')
    },

    applyStyles(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>, theme: MapTheme, visited: string[]): void {
        svg.selectAll<SVGPathElement, CountryFeature>('.country-side')
            .transition().duration(600)
            .attr('opacity', theme.is3D ? 1 : 0)
            .attr('fill', (d) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3 || ''
                const base = this.getDynamicColor(id, visited.includes(id), theme)
                return d3.color(base)?.darker(1.5).toString() || '#000'
            })

        svg.selectAll<SVGPathElement, CountryFeature>('.country-top')
            .transition().duration(600)
            .attr('fill', (d) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3 || ''
                return this.getDynamicColor(id, visited.includes(id), theme)
            })
            .attr('stroke', theme.colors.map.border)
            .attr('stroke-width', theme.strokeWidth)
            .attr('filter', theme.hasGrain ? 'url(#wood-grain-filter) url(#soft-shadow)' : (theme.is3D ? 'url(#soft-shadow)' : null))
    }
}