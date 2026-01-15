import type { MapTheme } from './types'

export const classic: MapTheme = {
    id: 'classic',
    name: 'Standard Dark',
    background: '#121212',
    is3D: false,
    hasGrain: false,
    colors: {
        visited: '#ffffff',
        unvisited: '#2c2c2c',
        border: '#555555'
    },
    strokeWidth: 0.8,
    loader: {
        overlayColor: '#121212',
        blur: 'backdrop-blur-3xl',
        spinnerColor: '#ffffff',
        accentColor: '#ffffff'
    },
    searchDock: {
        bg: 'rgba(44, 44, 44, 0.8)', // Серый фон дока
        border: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        placeholder: '#888888',
        iconBg: 'rgba(255, 255, 255, 0.05)',
        accent: '#ffffff',
        glow: 'rgba(255, 255, 255, 0.1)'
    },
    langSwitcher: {
        bg: 'rgba(255, 255, 255, 0.03)',
        text: '#888888',
        activeBg: '#ffffff',
        activeText: '#121212',
        border: 'rgba(255, 255, 255, 0.05)'
    },
    sidebar: {
        bg: '#121212',
        border: 'rgba(255, 255, 255, 0.05)',
        text: '#888888',
        accent: '#ffffff',
        activeBg: 'rgba(255, 255, 255, 0.05)'
    }
}