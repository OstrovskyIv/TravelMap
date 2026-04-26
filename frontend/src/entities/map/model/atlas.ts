import type { MapTheme } from './types'

export const atlas: MapTheme = {
    id: 'atlas',
    name: 'Vintage Atlas',
    price: 2000,
    background: '#d4e4f7',
    is3D: false,
    hasGrain: true,
    colors: {
        map: {
            visited: ['#f3e5ab'],
            unvisited: ['#fdfdfd'],
            border: '#4a5568',
            hover: '#e2e8f0',
            unlockedFill: '#f3e5ab',
            selectedFill: '#fbbf24'
        },
        ui: {
            accent: '#2d3748',
            textMain: '#1a202c',
            textMuted: '#718096',
            border: 'rgba(0, 0, 0, 0.1)',
            activeBg: 'rgba(0, 0, 0, 0.05)'
        }
    },
    countryModal: { bg: '#ffffff', border: '#2d3748', text: '#1a202c', overlay: 'rgba(0, 0, 0, 0.4)', buttonConfirmBg: '#2d3748', buttonConfirmText: '#ffffff', buttonCancelBg: '#f7fafc', buttonCancelText: '#718096' },
    infoModal: { bg: '#ffffff', border: 'rgba(0, 0, 0, 0.1)', text: '#1a202c', accent: '#2d3748', overlay: 'rgba(0, 0, 0, 0.5)', closeBtnBg: '#f7fafc' },
    mapTools: { bg: 'rgba(255, 255, 255, 0.9)', border: 'rgba(0, 0, 0, 0.1)', accent: '#2d3748', activeBg: 'rgba(0, 0, 0, 0.1)', btnBg: 'rgba(0, 0, 0, 0.05)' },
    strokeWidth: 0.8,
    loader: { overlayColor: '#d4e4f7', blur: 'backdrop-blur-md', spinnerColor: '#2d3748', accentColor: '#1a202c' },
    searchDock: { bg: 'rgba(255, 255, 255, 0.8)', border: 'rgba(0, 0, 0, 0.1)', text: '#1a202c', placeholder: '#718096', iconBg: 'rgba(0, 0, 0, 0.05)', accent: '#2d3748', glow: 'rgba(0, 0, 0, 0.05)' },
    langSwitcher: { bg: 'rgba(0, 0, 0, 0.05)', text: '#718096', activeBg: '#2d3748', activeText: '#ffffff', border: 'rgba(0, 0, 0, 0.1)' },
    sidebar: { bg: '#f7fafc', border: 'rgba(0, 0, 0, 0.1)', text: '#4a5568', accent: '#2d3748', activeBg: 'rgba(0, 0, 0, 0.05)' }
}