export interface MapTheme {
    id: string
    name: string
    background: string
    // Новое: параметры для "движка" отрисовки
    is3D: boolean         // Нужно ли рисовать торцы (объем)
    hasGrain: boolean     // Нужна ли текстура дерева
    colors: {
        visited: string | string[] // Может быть один цвет или массив для вариаций
        unvisited: string | string[]
        border: string
        side?: string       // Цвет торца для 3D
    }
}