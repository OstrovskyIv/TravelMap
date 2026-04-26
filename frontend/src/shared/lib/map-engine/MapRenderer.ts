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
    cachedLabels: null as d3.Selection<SVGTextElement, CountryFeature, SVGGElement, unknown> | null,
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
                this.flyTo(id, theme)
                onCountryClick(id)
            })
            .on('mouseenter', function(this: SVGPathElement, event, d) {
                d3.select(this).interrupt().transition().duration(200).attr('fill', 'var(--map-hover)')
                onCountryHover(d)
            })
            .on('mouseleave', function(this: SVGPathElement, event, d) {
                const id = (d.properties.ISO_A3 || d.properties.iso_a3)!
                d3.select(this).interrupt().transition().duration(200)
                    .attr('fill', MapHelpers.getColor(id, options.unlockedCountries, options.pendingId, options.visitedCities, theme))
                onCountryHover(null)
            })

        // (Лейблы и Зум остаются такими же, как в прошлом стабильном коде)
        this.cachedLabels = g.selectAll<SVGTextElement, CountryFeature>('text')
            .data(activeFeatures, (d: any) => d.properties.ISO_A3 || d.properties.iso_a3)
            .join('text').attr('text-anchor', 'middle').attr('pointer-events', 'none').attr('fill', 'white')
            .style('font-weight', '900').style('paint-order', 'stroke').style('stroke', 'rgba(0,0,0,0.6)').style('stroke-width', '2.5px')
            .style('display', showLabels ? 'block' : 'none')
            .text((d: any) => { const c = ALL_COUNTRIES.find(c => c.id === (d.properties.ISO_A3 || d.properties.iso_a3)); return c ? c.names.ru : '' })

        const update = (k: number = 1) => {
            if (!this.projection || !this.pathGenerator) return
            this.cachedPaths?.attr('d', this.pathGenerator as any)
            if (this.cachedLabels && showLabels) {
                this.cachedLabels.each(function(this: SVGTextElement, d) {
                    if (d.properties.centroid) {
                        const p = MapRenderer.projection!(d.properties.centroid)
                        if (p && isFinite(p[0])) d3.select(this).attr('x', p[0]).attr('y', p[1]).style('font-size', `${Math.min(13, 8 + Math.log2(k) * 1.5)}px`)
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

    highlightCountry(id: string | null, theme: MapTheme) {
        if (!this.cachedPaths || !this.lastOptions) return
        this.lastOptions.pendingId = id
        this.cachedPaths.transition().duration(400)
            .attr('fill', (d: any) => MapHelpers.getColor(d.properties.ISO_A3 || d.properties.iso_a3, this.lastOptions!.unlockedCountries, id, this.lastOptions!.visitedCities, theme))
            .attr('stroke-width', (d: any) => (d.properties.ISO_A3 || d.properties.iso_a3) === id ? 3 : theme.strokeWidth)
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
            })
        this.highlightCountry(id, theme)
    },

    programmaticZoom(level: number) { if (this.svgSelection && this.zoomBehavior) this.svgSelection.transition().duration(500).call(this.zoomBehavior.scaleTo, level) },
    toggleLabels(visible: boolean) {
        if (!this.cachedLabels) return
        this.cachedLabels.style('display', visible ? 'block' : 'none')
        if (visible && this.projection) {
            const k = this.zoomBehavior ? d3.zoomTransform(this.svgSelection!.node()!).k : 1
            this.cachedLabels.each(function(this: SVGTextElement, d) {
                const p = MapRenderer.projection!(d.properties.centroid!); if (p) d3.select(this).attr('x', p[0]).attr('y', p[1]).style('font-size', `${Math.min(13, 8 + Math.log2(k) * 1.5)}px`)
            })
        }
    }
}