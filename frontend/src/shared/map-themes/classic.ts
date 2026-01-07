import type { MapTheme } from './types'

export const classic: MapTheme = {
    id: 'classic',
    name: 'Standard Dark',
    background: '#0a0a0a',
    is3D: false,
    hasGrain: false,
    colors: {
        visited: '#3b82f6',
        unvisited: '#1c1c1c',
        border: '#2a2a2a'
    },
    strokeWidth: 1,
    loader: {
        overlayColor: '#0a0a0a',
        blur: 'backdrop-blur-2xl',
        spinnerColor: '#3b82f6',
        accentColor: '#ffffff'
    },
    searchDock: {
        bg: 'rgba(23, 23, 23, 0.8)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        placeholder: '#737373',
        iconBg: 'rgba(59, 130, 246, 0.2)',
        accent: '#3b82f6'
    }
}