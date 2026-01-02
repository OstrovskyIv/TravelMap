// src/shared/lib/LocalStorage.ts

const PREFIX = 'travel_map_'
const VERSION = '1.0'

export const LocalStorage = {
    save<T>(key: string, value: T): void {
        const payload = {
            version: VERSION,
            data: value,
            updatedAt: new Date().toISOString()
        }
        localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(payload))
    },

    load<T>(key: string): T | null {
        const raw = localStorage.getItem(`${PREFIX}${key}`)
        if (!raw) return null

        try {
            const parsed = JSON.parse(raw)
            if (parsed.version !== VERSION) {
                localStorage.removeItem(`${PREFIX}${key}`)
                return null
            }
            return parsed.data as T
        } catch (e) {
            return null
        }
    }
}