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
}