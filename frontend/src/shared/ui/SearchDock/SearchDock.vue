<template>
  <div class="flex flex-col gap-3 w-full max-w-[450px]">
    <Transition
        enter-active-class="transition-all duration-400 ease-out"
        enter-from-class="opacity-0 -translate-y-4 scale-[0.98]"
        leave-active-class="transition-all duration-300 ease-in"
        leave-to-class="opacity-0 -translate-y-4 scale-[0.98]"
    >
      <div v-if="searchQuery && filteredCountries.length > 0" class="flex flex-col gap-1 p-2 border backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[24px] overflow-y-auto max-h-[300px] custom-scrollbar" :style="{ backgroundColor: theme?.searchDock.bg, borderColor: theme?.searchDock.border }">
        <div v-for="country in filteredCountries" :key="country.id" @click="selectCountry(country.id)" class="flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all duration-200 group active:scale-[0.97]" :class="theme?.id === 'wooden' ? 'hover:bg-[#2b1a10]/5' : 'hover:bg-white/5'">
          <div class="flex flex-col gap-0.5">
            <span class="text-sm font-bold tracking-tight" :style="{ color: theme?.searchDock.text }">
              {{ country.names[langStore.currentLang] }}
            </span>
            <span class="text-[9px] uppercase tracking-widest opacity-40 font-mono" :style="{ color: theme?.searchDock.text }">
              {{ langStore.currentLang === 'ru' ? 'Профиль территории' : 'Territory Profile' }}
            </span>
          </div>
          <span class="text-[10px] font-black font-mono px-2 py-1 rounded-md bg-black/20" :style="{ color: theme?.searchDock.accent }">{{ country.id }}</span>
        </div>
      </div>
    </Transition>

    <!-- Панель ввода -->
    <div class="group relative flex items-center gap-4 p-2 border backdrop-blur-2xl rounded-[28px] transition-all duration-500" :class="isFocused ? 'shadow-2xl scale-[1.02]' : 'shadow-lg'"
        :style="{
        backgroundColor: theme?.searchDock.bg,
        borderColor: isFocused ? theme?.searchDock.accent : theme?.searchDock.border,
        boxShadow: isFocused ? `0 0 25px ${theme?.searchDock.glow}` : 'none'
      }">
      <div class="flex items-center justify-center w-12 h-12 rounded-[20px] transition-all duration-500" :style="{ backgroundColor: theme?.searchDock.iconBg }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" :stroke="theme?.searchDock.accent" class="w-5 h-5 transition-colors duration-500">
          <g stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </g>
        </svg>
      </div>
      <input
          v-model="searchQuery"
          @focus="isFocused = true"
          @blur="isFocused = false"
          type="text"
          :placeholder="langStore.currentLang === 'ru' ? 'Поиск территорий...' : 'Search territories...'"
          class="flex-1 bg-transparent border-none outline-none text-[15px] font-bold tracking-tight pr-4"
          :style="{ color: theme?.searchDock.text }"
      />

      <Transition enter-active-class="transition-opacity" enter-from-class="opacity-0" leave-to-class="opacity-0">
        <button v-if="searchQuery" @click="searchQuery = ''" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/10 transition-colors pr-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" :stroke="theme?.searchDock.text" class="w-4 h-4 opacity-30">
            <g stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </g>
          </svg>
        </button>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ALL_COUNTRIES } from '@/countries'
import { useLangStore } from '@/stores/langStore'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{ theme: MapTheme | undefined }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()

const langStore = useLangStore()
const searchQuery = ref('')
const isFocused = ref(false)

const filteredCountries = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase().trim()
  return ALL_COUNTRIES.filter(c =>
      c.names.ru.toLowerCase().includes(q) ||
      c.names.en.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  )
})

const selectCountry = (id: string) => {
  emit('select', id)
  searchQuery.value = ''
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}
</style>