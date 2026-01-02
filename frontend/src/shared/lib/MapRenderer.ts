import * as d3 from 'd3'
import type { MapTheme } from '@/shared/map-themes/types'

export const MapRenderer = {
    // Высчитываем цвет дерева (твоя логика вариаций)
    getWoodColor(iso: string, isVisited: boolean, theme: MapTheme): string {
        const palette = isVisited ? theme.colors.visited : theme.colors.unvisited
        const colors = Array.isArray(palette) ? palette : [palette]
        const charSum = iso.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        return (colors[charSum % colors.length] ?? colors[0]) as string
    },

    // 1. ПЕРВИЧНАЯ НАСТРОЙКА (Фильтры, структура)
    setupDefinitions(svg: d3.Selection<SVGSVGElement, unknown, null, undefined>) {
        const defs = svg.append('defs')

        // Фильтр волокон дерева
        const grain = defs.append('filter').attr('id', 'wood-grain-filter')
        grain.append('feTurbulence')
            .attr('type', 'fractalNoise')
            .attr('baseFrequency', '0.02 0.4')
            .attr('numOctaves', '3')
            .attr('result', 'noise')
        grain.append('feComposite')
            .attr('in', 'SourceGraphic')
            .attr('in2', 'noise')
            .attr('operator', 'arithmetic')
            .attr('k1', '0.2').attr('k2', '0.9')

        // Фильтр тени
        const shadow = defs.append('filter').attr('id', 'soft-shadow').attr('height', '150%')
        shadow.append('feDropShadow')
            .attr('dx', '1.5').attr('dy', '3.5')
            .attr('stdDeviation', '2.5')
            .attr('flood-color', '#261910')
            .attr('flood-opacity', '0.45')
    },

    // 2. ОБНОВЛЕНИЕ СТИЛЕЙ (Перекраска)
    applyStyles(svg: d3.Selection<any, any, any, any>, theme: MapTheme, visited: string[]) {
        const isWooden = theme.id === 'wooden'

        // Обновляем торцы (3D слой)
        svg.selectAll('.country-side')
            .transition().duration(800)
            .attr('opacity', theme.is3D ? 1 : 0)
            .attr('fill', (d: any) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3
                const base = this.getWoodColor(id, visited.includes(id), theme)
                return d3.color(base)?.darker(1.5).toString() || '#000'
            })

        // Обновляем поверхность
        svg.selectAll('.country-top')
            .transition().duration(800)
            .attr('fill', (d: any) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3
                const isVisited = visited.includes(id)
                return isWooden ? this.getWoodColor(id, isVisited, theme) : (isVisited ? (theme.colors.visited as string) : (theme.colors.unvisited as string))
            })
            .attr('stroke', theme.colors.border || '#000')
            .attr('filter', theme.hasGrain ? 'url(#wood-grain-filter) url(#soft-shadow)' : (theme.is3D ? 'url(#soft-shadow)' : null))
    }
}