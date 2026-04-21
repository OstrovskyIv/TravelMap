import type { MapTheme } from './types'

export const wooden: MapTheme = {
    id: 'wooden',
    name: 'Woodcraft 3D',
    price: 1000,
    background: '#edeae4',
    is3D: true,
    hasGrain: true,
    colors: {
        map: {
            visited: ['#5a3d2b', '#4a3222', '#6b4a36'],
            unvisited: ['#c4a484', '#b8926a', '#d2b48c'],
            border: '#261910',
            hover: '#78350f'
        },
        ui: {
            accent: '#5a3d2b',
            textMain: '#2b1a10',
            textMuted: '#8c7e6d',
            border: 'rgba(43, 26, 16, 0.1)',
            activeBg: 'rgba(90, 61, 43, 0.1)'
        }
    },
    countryModal: {
        bg: '#f3efe9',
        border: '#5a3d2b',
        text: '#2b1a10',
        overlay: 'rgba(43, 26, 16, 0.4)',
        buttonConfirmBg: '#5a3d2b',
        buttonConfirmText: '#f3efe9',
        buttonCancelBg: 'rgba(90, 61, 43, 0.05)',
        buttonCancelText: '#8c7e6d'
    },
    infoModal: {
        bg: '#f3efe9',
        border: 'rgba(90, 61, 43, 0.3)',
        text: '#2b1a10',
        accent: '#5a3d2b',
        overlay: 'rgba(0, 0, 0, 0.5)',
        closeBtnBg: 'rgba(90, 61, 43, 0.05)'
    },
    mapTools: {
        bg: 'rgba(243, 239, 233, 0.8)',
        border: 'rgba(90, 61, 43, 0.2)',
        accent: '#5a3d2b',
        activeBg: 'rgba(90, 61, 43, 0.2)',
        btnBg: 'rgba(90, 61, 43, 0.05)'
    },
    strokeWidth: 1.2,
    loader: {
        overlayColor: '#f3efe9',
        blur: 'backdrop-blur-3xl',
        spinnerColor: '#5a3d2b',
        accentColor: '#2b1a10'
    },
    searchDock: {
        bg: 'rgba(243, 239, 233, 0.7)',
        border: 'rgba(43, 26, 16, 0.1)',
        text: '#2b1a10',
        placeholder: '#8c7e6d',
        iconBg: 'rgba(90, 61, 43, 0.05)',
        accent: '#5a3d2b',
        glow: 'rgba(90, 61, 43, 0.15)'
    },
    langSwitcher: {
        bg: 'rgba(90, 61, 43, 0.05)',
        text: '#8c7e6d',
        activeBg: '#5a3d2b',
        activeText: '#f3efe9',
        border: 'rgba(43, 26, 16, 0.1)'
    },
    sidebar: {
        bg: '#f3efe9',
        border: 'rgba(43, 26, 16, 0.1)',
        text: '#8c7e6d',
        accent: '#5a3d2b',
        activeBg: 'rgba(90, 61, 43, 0.05)'
    }
}