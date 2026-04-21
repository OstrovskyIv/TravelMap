import { ref, onMounted } from 'vue'

interface DraggableConfig {
    initialX?: number
    initialY?: number
    initialWidth?: number
    initialHeight?: number
    minWidth?: number
    minHeight?: number
}

export function useDraggable(config: DraggableConfig = {}) {
    const position = ref({ x: config.initialX || 0, y: config.initialY || 0 })
    const size = ref({ w: config.initialWidth || 900, h: config.initialHeight || 600 })
    const isDragging = ref(false)
    const isResizing = ref(false)

    const startDragging = (e: MouseEvent) => {
        isDragging.value = true
        const offset = { x: e.clientX - position.value.x, y: e.clientY - position.value.y }

        const onMove = (ev: MouseEvent) => {
            position.value.x = ev.clientX - offset.x
            position.value.y = ev.clientY - offset.y
        }

        const onUp = () => {
            isDragging.value = false
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    const startResizing = (e: MouseEvent) => {
        e.stopPropagation()
        isResizing.value = true
        const startSize = { w: size.value.w, h: size.value.h }
        const startPos = { x: e.clientX, y: e.clientY }

        const onMove = (ev: MouseEvent) => {
            size.value.w = Math.max(config.minWidth || 750, startSize.w + (ev.clientX - startPos.x))
            size.value.h = Math.max(config.minHeight || 500, startSize.h + (ev.clientY - startPos.y))
        }

        const onUp = () => {
            isResizing.value = false
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseup', onUp)
    }

    onMounted(() => {
        if (!config.initialX && !config.initialY) {
            position.value.x = (window.innerWidth - size.value.w) / 2
            position.value.y = (window.innerHeight - size.value.h) / 2
        }
    })

    return {
        position,
        size,
        isDragging,
        isResizing,
        startDragging,
        startResizing
    }
}