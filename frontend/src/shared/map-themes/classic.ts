import type { MapTheme } from './types'

export const classic: MapTheme = {
    id: 'classic',
    name: 'Standard Dark',
    background: '#121212',
    is3D: false,
    hasGrain: false,
    colors: {
        visited: '#3b82f6',
        unvisited: '#2c2c2c',
        border: '#555555'
    },
    strokeWidth: 0.8,
    loader: {
        overlayColor: '#0a0a0a',
        blur: 'backdrop-blur-3xl',
        spinnerColor: '#3b82f6',
        accentColor: '#3b82f6'
    }
}