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
        bg: 'rgba(10, 10, 10, 0.7)',
        border: 'rgba(59, 130, 246, 0.2)',
        text: '#ffffff',
        placeholder: '#4b5563',
        iconBg: 'rgba(59, 130, 246, 0.1)',
        accent: '#3b82f6',
        glow: 'rgba(59, 130, 246, 0.3)'
    },
    langSwitcher: {
        bg: 'rgba(255, 255, 255, 0.05)',
        text: '#9ca3af',
        activeBg: '#3b82f6',
        activeText: '#ffffff',
        border: 'rgba(255, 255, 255, 0.1)'
    },
    sidebar: {
        bg: '#0a0a0a',
        border: 'rgba(255, 255, 255, 0.05)',
        text: '#9ca3af',
        accent: '#ffffff',
        activeBg: 'rgba(59, 130, 246, 0.1)'
    }
}