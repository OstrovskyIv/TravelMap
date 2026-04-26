<template>
  <div class="relative group/tooltip inline-block">
    <slot />

    <div
        :class="[
        'absolute z-[200] px-3 py-1.5 rounded-xl bg-black/90 border border-white/10 backdrop-blur-xl',
        'text-[10px] font-black uppercase tracking-[0.2em] text-white whitespace-nowrap',
        'pointer-events-none opacity-0 scale-95 group-hover/tooltip:opacity-100 group-hover/tooltip:scale-100 transition-all duration-200 shadow-2xl',
        positionClasses
      ]"
    >
      {{ text }}
      <div :class="['absolute w-1.5 h-1.5 bg-black rotate-45 border border-white/10', arrowClasses]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  text: string
  position?: 'left' | 'right' | 'top' | 'bottom'
}

const props = withDefaults(defineProps<Props>(), {
  position: 'left'
})

const positionClasses = computed(() => {
  switch (props.position) {
    case 'left': return 'right-full top-1/2 -translate-y-1/2 -translate-x-4'
    case 'right': return 'left-full top-1/2 -translate-y-1/2 translate-x-4'
    case 'top': return 'bottom-full left-1/2 -translate-x-1/2 -translate-y-4'
    case 'bottom': return 'top-full left-1/2 -translate-x-1/2 translate-y-4'
    default: return ''
  }
})

const arrowClasses = computed(() => {
  switch (props.position) {
    case 'left': return 'right-[-4px] top-1/2 -translate-y-1/2 border-l-0 border-b-0'
    case 'right': return 'left-[-4px] top-1/2 -translate-y-1/2 border-r-0 border-t-0'
    case 'top': return 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-0 border-t-0'
    case 'bottom': return 'top-[-4px] left-1/2 -translate-x-1/2 border-r-0 border-b-0'
    default: return ''
  }
})
</script>