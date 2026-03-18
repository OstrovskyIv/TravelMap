import * as d3 from 'd3'
import type { MapTheme } from '@entities/map/model/types'

export interface CountryProperties { ISO_A3?: string; iso_a3?: string }
export type CountryFeature = d3.ExtendedFeature<d3.GeoGeometryObjects | null, CountryProperties>

interface RenderOptions {
    container: HTMLElement
    features: CountryFeature[]
    theme: MapTheme
    visited: string[]
    onCountryClick: (id: string) => void
    onCountryHover: (feature: CountryFeature | null) => void
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

    renderMap(options: RenderOptions) {
        const { container, features, theme, visited, onCountryClick, onCountryHover } = options

        const d3Container = d3.select(container)
        d3Container.selectAll('*').remove()

        const width = container.clientWidth
        const height = container.clientHeight
        const projection = d3.geoMercator().fitSize([width - 150, height - 150], { type: "FeatureCollection", features } as any)
        const pathGenerator = d3.geoPath().projection(projection)

        const svg = d3Container.append('svg')
            .attr('width', width)
            .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`) as any

        this.setupDefinitions(svg)
        const g = svg.append('g').attr('transform', 'translate(75, 75)')

        features.forEach((feature) => {
            const id = (feature.properties.ISO_A3 || feature.properties.iso_a3) as string
            const countryGroup = g.append('g').style('cursor', 'pointer')


            countryGroup.append('path')
                .datum(feature)
                .attr('class', `country-side side-${id}`)
                .attr('d', pathGenerator as any)
                .attr('transform', 'translate(1, 4.5)')


            countryGroup.append('path')
                .datum(feature)
                .attr('class', `country-top top-${id}`)
                .attr('d', pathGenerator as any)
                .on('click', () => onCountryClick(id))
                .on('mouseenter', function (this: any) {
                    d3.select(this).interrupt().transition().duration(200).attr('fill', theme.colors.map.hover)
                    onCountryHover(feature)
                })
                .on('mouseleave', function (this: any) {
                    const isVisited = visited.includes(id)
                    const color = isVisited ? (theme.colors.map.visited[0] || '#fbbf24') : (theme.colors.map.unvisited[0] || '#1a1a1c')
                    d3.select(this).interrupt().transition().duration(300).attr('fill', color)
                    onCountryHover(null)
                })
        })

        this.applyStyles(svg, theme, visited)
        return svg
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