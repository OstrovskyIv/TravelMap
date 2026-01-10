export interface MapTheme {
    id: string
    name: string
    background: string
    is3D: boolean
    hasGrain: boolean
    colors: {
        visited: string | string[]
        unvisited: string | string[]
        border: string
    }
    strokeWidth: number
    loader: {
        overlayColor: string
        blur: string
        spinnerColor: string
        accentColor: string
    }
    searchDock: {
        bg: string
        border: string
        text: string
        placeholder: string
        iconBg: string
        accent: string
        glow: string
    }
    langSwitcher: {
        bg: string
        text: string
        activeBg: string
        activeText: string
        border: string
    }
}