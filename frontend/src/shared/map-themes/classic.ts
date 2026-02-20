import type { MapTheme } from './types'

export const classic: MapTheme = {
    id: 'classic',
    name: 'Classic Luxury',
    price: 0,
    background: '#0c0c0e',
    is3D: false,
    hasGrain: false,
    colors: {
        map: {
            visited: ['#fbbf24'],
            unvisited: ['#1a1a1c', '#1e1e20', '#222224'],
            border: '#2a2a2d',
            hover: '#3f3f46'
        },
        ui: {
            accent: '#fbbf24',
            textMain: '#ffffff',
            textMuted: '#a1a1aa',
            border: 'rgba(255, 255, 255, 0.08)',
            activeBg: 'rgba(251, 191, 36, 0.15)'
        }
    },
    countryModal: {
        bg: '#1a1a1c',
        border: '#fbbf24',
        text: '#ffffff',
        overlay: 'rgba(0, 0, 0, 0.8)',
        buttonConfirmBg: '#fbbf24',
        buttonConfirmText: '#0c0c0e',
        buttonCancelBg: 'rgba(255, 255, 255, 0.05)',
        buttonCancelText: '#a1a1aa'
    },
    infoModal: {
        bg: '#0c0c0e',
        border: 'rgba(251, 191, 36, 0.3)',
        text: '#ffffff',
        accent: '#fbbf24',
        overlay: 'rgba(0, 0, 0, 0.6)',
        closeBtnBg: 'rgba(255, 255, 255, 0.05)'
    },
    strokeWidth: 1,
    loader: {
        overlayColor: 'rgba(12, 12, 14, 0.9)',
        blur: 'backdrop-blur-3xl',
        spinnerColor: '#fbbf24',
        accentColor: '#ffffff'
    },
    searchDock: {
        bg: 'rgba(30, 30, 33, 0.7)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        placeholder: '#52525b',
        iconBg: 'rgba(251, 191, 36, 0.1)',
        accent: '#fbbf24',
        glow: 'rgba(251, 191, 36, 0.2)'
    },
    langSwitcher: {
        bg: 'rgba(255, 255, 255, 0.03)',
        text: '#71717a',
        activeBg: '#fbbf24',
        activeText: '#0c0c0e',
        border: 'rgba(255, 255, 255, 0.08)'
    },
    sidebar: {
        bg: '#18181b',
        border: 'rgba(251, 191, 36, 0.2)',
        text: '#a1a1aa',
        accent: '#fbbf24',
        activeBg: 'rgba(251, 191, 36, 0.1)'
    }
}