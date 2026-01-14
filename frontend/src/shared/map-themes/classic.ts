import type { MapTheme } from './types'

export const classic: MapTheme = {
    id: 'classic',
    name: 'Standard Dark',
    background: '#09090b',
    is3D: false,
    hasGrain: false,
    colors: {
        visited: '#fbbf24',
        unvisited: '#18181b',
        border: '#27272a'
    },
    strokeWidth: 1,
    loader: {
        overlayColor: '#09090b',
        blur: 'backdrop-blur-2xl',
        spinnerColor: '#fbbf24',
        accentColor: '#ffffff'
    },
    searchDock: {
        bg: 'rgba(24, 24, 27, 0.8)',
        border: 'rgba(251, 191, 36, 0.2)',
        text: '#ffffff',
        placeholder: '#71717a',
        iconBg: 'rgba(251, 191, 36, 0.1)',
        accent: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.2)'
    },
    langSwitcher: {
        bg: 'rgba(255, 255, 255, 0.05)',
        text: '#a1a1aa',
        activeBg: '#fbbf24',
        activeText: '#000000',
        border: 'rgba(255, 255, 255, 0.1)'
    },
    sidebar: {
        bg: '#09090b',
        border: 'rgba(255, 255, 255, 0.05)',
        text: '#71717a',
        accent: '#ffffff',
        activeBg: 'rgba(251, 191, 36, 0.1)'
    }
}