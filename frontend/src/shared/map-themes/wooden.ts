import type { MapTheme } from './types'
export const wooden: MapTheme = {
    id: 'wooden',
    name: 'Woodcraft 3D',
    background: '#edeae4',
    is3D: true,
    hasGrain: true,
    colors: {
        visited: ['#5a3d2b', '#4a3222', '#6b4a36'],
        unvisited: ['#c4a484', '#b8926a', '#d2b48c'],
        border: '#261910'
    }
}