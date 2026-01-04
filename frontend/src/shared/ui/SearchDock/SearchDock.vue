<template>
  <div class="flex flex-col gap-2 w-full max-w-[400px]">
    <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        leave-active-class="transition-all duration-200 ease-in"
        leave-to-class="opacity-0 translate-y-4 scale-95">
      <div v-if="searchQuery && filteredCountries.length > 0" class="flex flex-col gap-1 p-2 border backdrop-blur-2xl shadow-2xl max-h-[200px] overflow-y-auto rounded-2xl" :style="{ backgroundColor: theme?.searchDock?.bg, borderColor: theme?.searchDock?.border }">
        <div v-for="country in filteredCountries" :key="country.id" @click="selectCountry(country.id)" class="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors group hover:bg-black/5">
          <span class="text-sm font-bold" :style="{ color: theme?.searchDock?.text }">{{ country.name }}</span>
          <span class="text-[10px] opacity-40 font-mono uppercase" :style="{ color: theme?.searchDock?.text }">{{ country.id }}</span>
        </div>
      </div>
    </Transition>

    <div class="flex items-center gap-3 p-2 border backdrop-blur-xl shadow-lg rounded-2xl transition-all duration-500" :style="{ backgroundColor: theme?.searchDock?.bg, borderColor: theme?.searchDock?.border }">
      <div class="flex items-center justify-center w-10 h-10 rounded-xl" :style="{ backgroundColor: theme?.searchDock?.iconBg, color: theme?.searchDock?.accent }">🔍</div>
      <input v-model="searchQuery" type="text" placeholder="Find country..." class="flex-1 bg-transparent border-none outline-none text-sm font-medium pr-4" :style="{ color: theme?.searchDock?.text }"/>
      <button v-if="searchQuery" @click="searchQuery = ''" class="w-8 h-8 flex items-center justify-center rounded-lg opacity-40 hover:opacity-100" :style="{ color: theme?.searchDock?.text }">✕</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ALL_COUNTRIES } from '@/countries'
import type { MapTheme } from '@/shared/map-themes/types'

defineProps<{ theme: MapTheme | undefined }>()
const emit = defineEmits<{ (e: 'select', id: string): void }>()
const searchQuery = ref('')

const filteredCountries = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase().trim()
  return ALL_COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
})

const selectCountry = (id: string) => {
  emit('select', id)
  searchQuery.value = ''
}
</script>