import * as d3 from 'd3'
import type { MapTheme } from '@entities/map/model/types'
import { ALL_COUNTRIES } from '@entities/country/model'
import { MapHelpers } from './helpers'
import type { CountryFeature, RenderOptions } from './types'

export const MapRenderer = {
    svgSelection: null as d3.Selection<SVGSVGElement, unknown, null, undefined> | null,
    projection: null as d3.GeoProjection | null,
    zoomBehavior: null as d3.ZoomBehavior<SVGSVGElement, unknown> | null,
    pathGenerator: null as d3.GeoPath | null,
    cachedPaths: null as d3.Selection<SVGPathElement, CountryFeature, SVGGElement, unknown> | null,
    cachedLabels: null as d3.Selection<SVGGElement, CountryFeature, SVGGElement, unknown> | null,
    isUpdating: false,
    initialScale: 1, lastX: 0, lastY: 0,
    lastOptions: null as RenderOptions | null,

    renderMap(options: RenderOptions) {
        this.lastOptions = options
        const { container, features, theme, unlockedCountries, pendingId, visitedCities, showLabels, onCountryClick, onCountryHover } = options
        const width = container.clientWidth; const height = container.clientHeight
        let svg = d3.select(container).select<SVGSVGElement>('svg')
        if (svg.empty()) {
            svg = d3.select(container).append('svg')
                .attr('width', width).attr('height', height)
                .style('cursor', 'grab').style('touch-action', 'none').style('overscroll-behavior', 'none') as any
        }
        this.svgSelection = svg
        const activeFeatures = features.filter(f => {
            const id = f.properties.ISO_A3 || f.properties.iso_a3
            if (ALL_COUNTRIES.some(c => c.id === id)) {
                if (!f.properties.centroid) f.properties.centroid = d3.geoCentroid(f as any)
                return true
            }
            return false
        })
        const projection = d3.geoMercator().rotate([-100, 0]).scale(width / (2 * Math.PI)).translate([width / 2, height / 2]).center([0, 45]).precision(0.5)
        this.initialScale = projection.scale(); this.projection = projection; this.pathGenerator = d3.geoPath().projection(projection)
        let g = svg.select<SVGGElement>('g')
        if (g.empty()) g = svg.append('g')
        this.cachedPaths = g.selectAll<SVGPathElement, CountryFeature>('path.country')
            .data(activeFeatures, (d: any) => d.properties.ISO_A3 || d.properties.iso_a3)
            .join('path').attr('class', 'country')
            .attr('fill', (d) => MapHelpers.getColor((d.properties.ISO_A3 || d.properties.iso_a3)!, unlockedCountries, pendingId, visitedCities, theme))
            .attr('stroke', 'var(--map-border)').attr('stroke-width', theme.strokeWidth)
            .attr('d', this.pathGenerator as any)
            .on('click', (event, d) => {
                event.stopPropagation()
                const id = (d.properties.ISO_A3 || d.properties.iso_a3)!
                onCountryClick(id)
            })
            .on('mouseenter', function(this: SVGPathElement, _, d) {
                d3.select(this).interrupt().transition().duration(200).attr('fill', 'var(--map-hover)')
                onCountryHover(d)
            })
            .on('mouseleave', function(this: SVGPathElement, _, d) {
                const id = (d.properties.ISO_A3 || d.properties.iso_a3)!
                d3.select(this).interrupt().transition().duration(200)
                    .attr('fill', MapHelpers.getColor(id, options.unlockedCountries, options.pendingId, options.visitedCities, theme))
                onCountryHover(null)
            })
        g.selectAll('.country-label').remove()
        this.cachedLabels = g.selectAll<SVGGElement, CountryFeature>('.country-label')
            .data(activeFeatures, (d: any) => d.properties.ISO_A3 || d.properties.iso_a3)
            .enter().append('g').attr('class', 'country-label').attr('pointer-events', 'none')
            .style('display', showLabels ? 'block' : 'none')
        this.cachedLabels.append('text').attr('class', 'label-text').attr('text-anchor', 'middle').attr('fill', 'white')
            .style('font-weight', '900').style('paint-order', 'stroke').style('stroke', 'rgba(0,0,0,0.8)').style('stroke-width', '3px')
            .text((d: any) => {
                const id = d.properties.ISO_A3 || d.properties.iso_a3
                const c = ALL_COUNTRIES.find(item => item.id === id)
                if (!c) return ''
                const visitedCount = visitedCities[id]?.length || 0
                return `${c.flag || '📍'} ${c.names.ru} ${visitedCount}/${c.cities.length}`
            })
        const update = (k: number = 1) => {
            if (!this.projection || !this.pathGenerator) return
            this.cachedPaths?.attr('d', this.pathGenerator as any)
            this.drawRouteUpdate()
            if (this.cachedLabels && showLabels) {
                this.cachedLabels.each(function(this: SVGGElement, d) {
                    if (d.properties.centroid) {
                        const p = MapRenderer.projection!(d.properties.centroid)
                        const id = d.properties.ISO_A3 || d.properties.iso_a3
                        const c = ALL_COUNTRIES.find(item => item.id === id)
                        if (p && isFinite(p[0]) && c) {
                            const isSmall = c.cities.length < 3
                            const importanceScale = isSmall ? 3.5 : 1.1
                            const opacity = k >= importanceScale ? 1 : (isSmall ? 0 : 0.6)
                            const fontSize = Math.max(7, Math.min(15, 6 + Math.log2(k) * 2.5))
                            d3.select(this).attr('transform', `translate(${p[0]}, ${p[1]})`).style('opacity', opacity).select('text').style('font-size', `${fontSize}px`)
                        }
                    }
                })
            }
        }
        const zoom = d3.zoom<SVGSVGElement, unknown>().scaleExtent([1, 20])
            .on('start', (e) => { this.lastX = e.transform.x; this.lastY = e.transform.y })
            .on('zoom', (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
                if (this.isUpdating) return; this.isUpdating = true
                window.requestAnimationFrame(() => {
                    const { transform, sourceEvent } = event
                    const rotation = this.projection!.rotate(); const sens = 360 / (2 * Math.PI * (this.initialScale * transform.k))
                    if (sourceEvent && sourceEvent.type !== 'wheel') {
                        const center = this.projection!.center()
                        this.projection!.rotate([rotation[0] + (transform.x - this.lastX) * sens, 0])
                        this.projection!.center([0, Math.max(-60, Math.min(80, center[1] + (transform.y - this.lastY) * sens * 0.5))])
                    }
                    this.projection!.scale(transform.k * this.initialScale)
                    this.lastX = transform.x; this.lastY = transform.y
                    update(transform.k); this.isUpdating = false
                })
            })
        svg.call(zoom); update(d3.zoomTransform(svg.node()!).k)
        this.zoomBehavior = zoom
    },

    resetView() {
        if (!this.svgSelection || !this.zoomBehavior || !this.projection) return
        this.svgSelection.transition().duration(1000).ease(d3.easeCubicInOut)
            .call(this.zoomBehavior.transform, d3.zoomIdentity)
            .tween("reset", () => {
                const iR = d3.interpolateNumber(this.projection!.rotate()[0], -100)
                const iC = d3.interpolateNumber(this.projection!.center()[1], 45)
                const iS = d3.interpolateNumber(this.projection!.scale(), this.initialScale)
                return (t: number) => {
                    this.projection!.rotate([iR(t), 0]).center([0, iC(t)]).scale(iS(t))
                    if (this.cachedPaths && this.pathGenerator) this.cachedPaths.attr('d', this.pathGenerator as any)
                    this.drawRouteUpdate()
                }
            })
    },

    drawRoute(points: string[], features: any[], theme: MapTheme) {
        if (!this.svgSelection || !this.projection) return
        const g = this.svgSelection.select<SVGGElement>('g')
        g.selectAll('.route-group').remove()
        if (points.length === 0) return
        const routeG = g.append('g').attr('class', 'route-group')
        const lineData: [number, number][] = points.map(id => features.find((f: any) => (f.properties.ISO_A3 || f.properties.iso_a3) === id)?.properties.centroid).filter(Boolean)
        if (lineData.length > 1) {
            const lineGenerator = d3.line<[number, number]>().x(d => (this.projection!(d) || [0, 0])[0]).y(d => (this.projection!(d) || [0, 0])[1])
            routeG.append('path').datum(lineData).attr('class', 'route-line').attr('fill', 'none').attr('stroke', theme.colors.ui.accent).attr('stroke-width', 3).attr('stroke-dasharray', '8,4').attr('d', lineGenerator as any)
        }
        routeG.selectAll('.route-dot').data(lineData).enter().append('circle').attr('class', 'route-dot').attr('cx', d => (this.projection!(d as [number, number]) || [0, 0])[0]).attr('cy', d => (this.projection!(d as [number, number]) || [0, 0])[1]).attr('r', 5).attr('fill', theme.colors.ui.accent).attr('stroke', 'white').attr('stroke-width', 2)
    },

    drawRouteUpdate() {
        if (!this.svgSelection || !this.projection) return
        const g = this.svgSelection.select('.route-group')
        if (g.empty()) return
        const lineGenerator = d3.line<[number, number]>().x(d => (this.projection!(d) || [0, 0])[0]).y(d => (this.projection!(d) || [0, 0])[1])
        g.select('.route-line').attr('d', lineGenerator as any)
        g.selectAll('.route-dot').attr('cx', (d: any) => (this.projection!(d) || [0, 0])[0]).attr('cy', (d: any) => (this.projection!(d) || [0, 0])[1])
    },

    highlightCountry(id: string | null, theme: MapTheme) {
        if (!this.cachedPaths || !this.lastOptions) return
        this.lastOptions.pendingId = id
        this.cachedPaths.transition().duration(400).attr('fill', (d: any) => MapHelpers.getColor(d.properties.ISO_A3 || d.properties.iso_a3, this.lastOptions!.unlockedCountries, id, this.lastOptions!.visitedCities, theme)).attr('stroke-width', (d: any) => (d.properties.ISO_A3 || d.properties.iso_a3) === id ? 3 : theme.strokeWidth)
    },

    flyTo(id: string, theme: MapTheme) {
        if (!this.cachedPaths || !this.projection || !this.svgSelection || !this.zoomBehavior) return
        const feature = this.cachedPaths.data().find(d => (d.properties.ISO_A3 || d.properties.iso_a3) === id)
        if (!feature || !feature.properties.centroid) return
        const currentK = d3.zoomTransform(this.svgSelection.node()!).k
        this.svgSelection.transition().duration(1000).ease(d3.easeCubicInOut)
            .call(this.zoomBehavior.transform, d3.zoomIdentity.translate(0, 0).scale(5))
            .tween("fly", () => (t: number) => {
                const iR = d3.interpolateNumber(this.projection!.rotate()[0], -feature.properties.centroid![0])
                const iC = d3.interpolateNumber(this.projection!.center()[1], feature.properties.centroid![1])
                const iS = d3.interpolateNumber(currentK, 5)
                this.projection!.rotate([iR(t), 0]).center([0, iC(t)]).scale(iS(t) * this.initialScale)
                if (this.cachedPaths && this.pathGenerator) this.cachedPaths.attr('d', this.pathGenerator as any)
                this.drawRouteUpdate()
            })
        this.highlightCountry(id, theme)
    },

    programmaticZoom(level: number) { if (this.svgSelection && this.zoomBehavior) this.svgSelection.transition().duration(500).call(this.zoomBehavior.scaleTo, level) },
    toggleLabels(visible: boolean) {
        if (!this.cachedLabels) return
        this.cachedLabels.style('display', visible ? 'block' : 'none')
        if (visible && this.projection) {
            const k = this.zoomBehavior ? d3.zoomTransform(this.svgSelection!.node()!).k : 1
            this.cachedLabels.each(function(this: SVGGElement, d) {
                const p = MapRenderer.projection!(d.properties.centroid!); if (p) d3.select(this).attr('transform', `translate(${p[0]}, ${p[1]})`)
            })
        }
    }
}