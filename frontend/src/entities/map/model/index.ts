import { classic } from './classic'
import { wooden } from './wooden'
import { atlas } from './atlas'
import type { MapTheme } from './types'

export type { MapTheme }
export const MAP_THEMES: Record<string, MapTheme> = {
    atlas,
    classic,
    wooden
}