import type { MapTheme } from '../model/types'

export const mapThemeToCssVars = (theme: MapTheme) => {
    return {
        '--bg-main': theme.background,
        '--ui-accent': theme.colors.ui.accent,
        '--ui-text': theme.colors.ui.textMain,
        '--ui-text-muted': theme.colors.ui.textMuted,
        '--ui-border': theme.colors.ui.border,
        '--ui-active-bg': theme.colors.ui.activeBg,

        '--sidebar-bg': theme.sidebar.bg,
        '--sidebar-border': theme.sidebar.border,

        '--modal-bg': theme.countryModal.bg,
        '--modal-overlay': theme.countryModal.overlay,

        '--search-bg': theme.searchDock.bg,
        '--search-border': theme.searchDock.border,
        '--search-glow': theme.searchDock.glow,

        '--loader-overlay': theme.loader.overlayColor,
        '--loader-spinner': theme.loader.spinnerColor,

        // КАРТА
        '--map-unvisited': theme.colors.map.unvisited[0],
        '--map-border': theme.colors.map.border,
        '--map-hover': theme.colors.map.hover,
        '--map-unlocked': theme.colors.map.unlockedFill,
        '--map-selected': theme.colors.map.selectedFill
    } as Record<string, string>
}