import { classic } from './classic'
import { wooden } from './wooden'
import type { MapTheme } from './types'

export type { MapTheme }
export const MAP_THEMES: Record<string, MapTheme> = {
    classic,
    wooden
}