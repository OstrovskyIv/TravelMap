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
        overlayColor: string    // Цвет фона оверлея (например, прозрачный черный или бежевый)
        blur: string            // Степень размытия (Tailwind класс: backdrop-blur-md, xl и т.д.)
        spinnerColor: string    // Цвет крутящегося кольца
        accentColor: string
    }
}