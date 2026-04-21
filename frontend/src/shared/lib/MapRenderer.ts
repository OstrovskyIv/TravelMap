import * as d3 from 'd3'
import type { MapTheme } from '@entities/map/model/types'
import { ALL_COUNTRIES } from '@entities/country/model'

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
    svgSelection: null as d3.Selection<SVGSVGElement, unknown, null, undefined> | null,
    projection: null as d3.GeoProjection | null,
    zoomBehavior: null as d3.ZoomBehavior<SVGSVGElement, unknown> | null,
    pathGenerator: null as d3.GeoPath | null,
    cachedPaths: null as d3.Selection<SVGPathElement, CountryFeature, SVGGElement, unknown> | null,
    isUpdating: false,
    initialScale: 1,

    getDynamicColor(isVisited: boolean, theme: MapTheme): string {
        const palette = isVisited ? theme.colors.map.visited : theme.colors.map.unvisited
        return palette[0] || '#333'
    },

    renderMap(options: RenderOptions) {
        const { container, features, theme, visited, onCountryClick, onCountryHover } = options

        let svg = d3.select(container).select<SVGSVGElement>('svg')
        if (svg.empty()) {
            svg = d3.select(container).append('svg')
                .attr('width', container.clientWidth)
                .attr('height', container.clientHeight)
                .style('cursor', 'grab')
                .style('touch-action', 'none')
        }
        this.svgSelection = svg

        const width = container.clientWidth
        const height = container.clientHeight

        const activeFeatures = features.filter(f =>
            ALL_COUNTRIES.some(c => c.id === (f.properties.ISO_A3 || f.properties.iso_a3))
        )

        const projection = d3.geoMercator()
            .rotate([-100, 0])
            .scale(width / (2 * Math.PI))
            .translate([width / 2, height / 2])
            .center([0, 45])
            .precision(0.5)

        this.initialScale = projection.scale()
        this.projection = projection
        this.pathGenerator = d3.geoPath().projection(projection)

        let g = svg.select<SVGGElement>('g')
        if (g.empty()) g = svg.append('g')

        this.cachedPaths = g.selectAll<SVGPathElement, CountryFeature>('path')
            .data(activeFeatures, (d: any) => d.properties.ISO_A3 || d.properties.iso_a3)
            .join('path')
            .attr('fill', (d) => this.getDynamicColor(visited.includes(d.properties.ISO_A3 || d.properties.iso_a3 || ''), theme))
            .attr('stroke', theme.colors.map.border)
            .attr('stroke-width', theme.strokeWidth)
            .attr('d', this.pathGenerator as any)
            .on('click', (event, d) => {
                event.stopPropagation()
                const id = (d.properties.ISO_A3 || d.properties.iso_a3) as string
                this.flyTo(id, theme)
                onCountryClick(id)
            })

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 20])
            .on('zoom', (event) => {
                if (this.isUpdating) return
                this.isUpdating = true

                window.requestAnimationFrame(() => {
                    const rotation = this.projection!.rotate()
                    const sensitivity = 0.25 / event.transform.k

                    if (event.sourceEvent) {
                        const dx = event.sourceEvent.movementX || 0
                        const dy = event.sourceEvent.movementY || 0
                        this.projection!.rotate([rotation[0] + dx * sensitivity, 0])
                        const currentCenter = this.projection!.center()
                        this.projection!.center([0, Math.max(-60, Math.min(80, currentCenter[1] + dy * sensitivity * 0.5))])
                    }

                    this.projection!.scale(event.transform.k * this.initialScale)
                    if (this.cachedPaths) this.cachedPaths.attr('d', this.pathGenerator as any)
                    this.isUpdating = false
                })
            })

        svg.call(zoom)
        this.zoomBehavior = zoom
    },

    highlightCountry(id: string | null, theme: MapTheme) {
        if (!this.cachedPaths) return
        this.cachedPaths.transition().duration(400)
            .attr('stroke', (d) => {
                const countryId = d.properties.ISO_A3 || d.properties.iso_a3
                return countryId === id ? 'var(--ui-accent)' : theme.colors.map.border
            })
            .attr('stroke-width', (d) => {
                const countryId = d.properties.ISO_A3 || d.properties.iso_a3
                return countryId === id ? 3 : theme.strokeWidth
            })
    },

    flyTo(id: string, theme: MapTheme) {
        if (!this.cachedPaths || !this.projection || !this.svgSelection || !this.zoomBehavior) return
        const feature = this.cachedPaths.data().find(d => (d.properties.ISO_A3 || d.properties.iso_a3) === id)
        if (!feature) return

        const centroid = d3.geoCentroid(feature as any)
        const currentK = d3.zoomTransform(this.svgSelection.node()!).k

        this.svgSelection.transition().duration(1000)
            .ease(d3.easeCubicInOut)
            .call(this.zoomBehavior.scaleTo, 5)
            .tween("fly", () => {
                const iRotate = d3.interpolateNumber(this.projection!.rotate()[0], -centroid[0])
                const iCenter = d3.interpolateNumber(this.projection!.center()[1], centroid[1])
                const iScale = d3.interpolateNumber(currentK, 5)

                return (t) => {
                    this.projection!.rotate([iRotate(t), 0])
                    this.projection!.center([0, iCenter(t)])
                    this.projection!.scale(iScale(t) * this.initialScale)
                    if (this.cachedPaths) this.cachedPaths.attr('d', this.pathGenerator as any)
                }
            })

        this.highlightCountry(id, theme)
    },

    // ВОТ ОН - ПРОПУЩЕННЫЙ МЕТОД
    programmaticZoom(level: number) {
        if (!this.svgSelection || !this.zoomBehavior) return
        // scaleTo автоматически вызывает событие 'zoom', которое перерисовывает карту
        this.svgSelection.transition().duration(500).call(this.zoomBehavior.scaleTo, level)
    }
}