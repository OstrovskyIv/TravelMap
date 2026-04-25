import * as d3 from 'd3'
import type { MapTheme } from '@entities/map/model/types'
import { ALL_COUNTRIES } from '@entities/country/model'

export interface CountryProperties {
    ISO_A3?: string;
    iso_a3?: string;
    centroid?: [number, number];
}
export type CountryFeature = d3.ExtendedFeature<d3.GeoGeometryObjects | null, CountryProperties>

interface RenderOptions {
    container: HTMLElement
    features: CountryFeature[]
    theme: MapTheme
    visited: string[]
    showLabels: boolean
    onCountryClick: (id: string) => void
    onCountryHover: (feature: CountryFeature | null) => void
}

export const MapRenderer = {
    svgSelection: null as d3.Selection<SVGSVGElement, unknown, null, undefined> | null,
    projection: null as d3.GeoProjection | null,
    zoomBehavior: null as d3.ZoomBehavior<SVGSVGElement, unknown> | null,
    pathGenerator: null as d3.GeoPath | null,
    cachedPaths: null as d3.Selection<SVGPathElement, CountryFeature, SVGGElement, unknown> | null,
    cachedLabels: null as d3.Selection<SVGTextElement, CountryFeature, SVGGElement, unknown> | null,
    isUpdating: false,
    initialScale: 1,

    // Внутренние переменные для отслеживания дельты
    lastX: 0,
    lastY: 0,

    getDynamicColor(isVisited: boolean, theme: MapTheme): string {
        const palette = isVisited ? theme.colors.map.visited : theme.colors.map.unvisited
        return palette[0] || '#333'
    },

    renderMap(options: RenderOptions) {
        const { container, features, theme, visited, showLabels, onCountryClick, onCountryHover } = options

        let svg = d3.select(container).select<SVGSVGElement>('svg')
        if (svg.empty()) {
            svg = d3.select(container).append('svg')
                .attr('width', container.clientWidth)
                .attr('height', container.clientHeight)
                .style('cursor', 'grab')
                .style('touch-action', 'none')
                .style('overscroll-behavior', 'none') as any
        }
        this.svgSelection = svg

        const width = container.clientWidth
        const height = container.clientHeight

        const activeFeatures = features.filter(f => {
            const id = f.properties.ISO_A3 || f.properties.iso_a3
            const exists = ALL_COUNTRIES.some(c => c.id === id)
            if (exists && !f.properties.centroid) {
                f.properties.centroid = d3.geoCentroid(f as any)
            }
            return exists
        })

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

        this.cachedLabels = g.selectAll<SVGTextElement, CountryFeature>('text')
            .data(activeFeatures, (d: any) => d.properties.ISO_A3 || d.properties.iso_a3)
            .join('text')
            .attr('text-anchor', 'middle')
            .attr('pointer-events', 'none')
            .attr('fill', 'white')
            .attr('font-size', '8px')
            .attr('font-weight', '900')
            .style('display', showLabels ? 'block' : 'none')
            .text((d) => {
                const country = ALL_COUNTRIES.find(c => c.id === (d.properties.ISO_A3 || d.properties.iso_a3))
                return country ? country.names.ru : ''
            })

        const updateElements = () => {
            if (!this.projection || !this.pathGenerator) return

            this.cachedPaths?.attr('d', (d) => {
                const dStr = this.pathGenerator!(d as any)
                return dStr && !dStr.includes('NaN') ? dStr : null
            })

            if (this.cachedLabels && showLabels) {
                this.cachedLabels.each(function(this: SVGTextElement, d) {
                    if (d.properties.centroid) {
                        const coords = MapRenderer.projection!(d.properties.centroid)
                        if (coords && isFinite(coords[0]) && isFinite(coords[1])) {
                            d3.select(this).attr('x', coords[0]).attr('y', coords[1])
                                .style('opacity', coords[1] < 0 || coords[1] > height ? 0 : 1)
                        }
                    }
                })
            }
        }

        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 20])
            .on('start', (event) => {
                this.lastX = event.transform.x
                this.lastY = event.transform.y
            })
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                if (this.isUpdating) return
                this.isUpdating = true

                window.requestAnimationFrame(() => {
                    const { transform, sourceEvent } = event
                    const rotation = this.projection!.rotate()
                    const center = this.projection!.center()

                    const sensitivity = 0.25 / transform.k

                    if (sourceEvent) {
                        if (sourceEvent.type === 'wheel') {
                        } else {
                            const dx = transform.x - this.lastX
                            const dy = transform.y - this.lastY

                            this.projection!.rotate([rotation[0] + dx * sensitivity, 0])
                            this.projection!.center([0, Math.max(-60, Math.min(80, center[1] + dy * sensitivity * 0.5))])
                        }
                    }

                    this.projection!.scale(transform.k * this.initialScale)

                    this.lastX = transform.x
                    this.lastY = transform.y

                    updateElements()
                    this.isUpdating = false
                })
            })

        svg.call(zoom)
        this.zoomBehavior = zoom
        updateElements()
    },

    toggleLabels(visible: boolean) {
        if (!this.cachedLabels || !this.projection) return
        this.cachedLabels.style('display', visible ? 'block' : 'none')
        if (visible) {
            this.cachedLabels.each(function(this: SVGTextElement, d) {
                if (d.properties.centroid) {
                    const coords = MapRenderer.projection!(d.properties.centroid)
                    if (coords && isFinite(coords[0]) && isFinite(coords[1])) {
                        d3.select(this).attr('x', coords[0]).attr('y', coords[1])
                    }
                }
            })
        }
    },

    highlightCountry(id: string | null, theme: MapTheme) {
        if (!this.cachedPaths) return
        this.cachedPaths.transition().duration(400)
            .attr('stroke', (d) => (d.properties.ISO_A3 || d.properties.iso_a3) === id ? 'var(--ui-accent)' : theme.colors.map.border)
            .attr('stroke-width', (d) => (d.properties.ISO_A3 || d.properties.iso_a3) === id ? 3 : theme.strokeWidth)
    },

    flyTo(id: string, theme: MapTheme) {
        if (!this.cachedPaths || !this.projection || !this.svgSelection || !this.zoomBehavior) return
        const feature = this.cachedPaths.data().find(d => (d.properties.ISO_A3 || d.properties.iso_a3) === id)
        if (!feature || !feature.properties.centroid) return

        const currentK = d3.zoomTransform(this.svgSelection.node()!).k
        const targetK = 5

        const iRotate = d3.interpolateNumber(this.projection!.rotate()[0], -feature.properties.centroid[0])
        const iCenter = d3.interpolateNumber(this.projection!.center()[1], feature.properties.centroid[1])
        const iScale = d3.interpolateNumber(currentK, targetK)

        this.svgSelection.transition().duration(1000).ease(d3.easeCubicInOut)
            .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(0, 0).scale(targetK))
            .tween("fly", () => (t: number) => {
                this.projection!.rotate([iRotate(t), 0])
                this.projection!.center([0, iCenter(t)])
                this.projection!.scale(iScale(t) * this.initialScale)

                this.cachedPaths?.attr('d', this.pathGenerator as any)
                if (this.cachedLabels) {
                    this.cachedLabels.each(function(this: SVGTextElement, d) {
                        if (d.properties.centroid) {
                            const p = MapRenderer.projection!(d.properties.centroid)
                            if (p) d3.select(this).attr('x', p[0]).attr('y', p[1])
                        }
                    })
                }
            })
        this.highlightCountry(id, theme)
    },

    programmaticZoom(level: number) {
        if (!this.svgSelection || !this.zoomBehavior) return
        this.svgSelection.transition().duration(500).call(this.zoomBehavior.scaleTo, level)
    }
}