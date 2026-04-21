<template>
  <div :class="['flex flex-col gap-3 w-full transition-all max-w-[450px]']">
    <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 -translate-y-4">
      <div v-if="searchQuery && filteredCountries.length > 0" class="flex flex-col gap-1 p-2 border backdrop-blur-3xl rounded-[24px] overflow-y-auto max-h-[300px] bg-[var(--search-bg)] border-[var(--search-border)]">
        <div v-for="country in filteredCountries" :key="country.id" @click="selectCountry(country.id)" class="flex items-center justify-between p-4 rounded-xl cursor-pointer hover:bg-white/5 group">
          <div class="flex flex-col">
            <span class="text-sm font-bold text-white">{{ country.names[langStore.currentLang] }}</span>
            <span class="text-[9px] uppercase opacity-40 font-mono text-white group-hover:text-[var(--ui-accent)]">{{ langStore.t.search.profile }}</span>
          </div>
          <span class="text-[10px] font-mono text-[var(--ui-accent)] bg-black/20 px-2 py-1 rounded">{{ country.id }}</span>
        </div>
      </div>
    </Transition>

    <div class="group relative flex items-center gap-4 p-2 border backdrop-blur-2xl rounded-[28px] transition-all bg-[var(--search-bg)] border-[var(--search-border)]" :class="{ 'shadow-2xl border-[var(--ui-accent)]': isFocused }">
      <div class="flex items-center justify-center w-12 h-12 rounded-[20px] bg-[var(--ui-accent)]/10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="var(--ui-accent)" class="w-5 h-5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input v-model="searchQuery" @focus="isFocused = true" @blur="isFocused = false" type="text" :placeholder="langStore.t.search.placeholder" class="flex-1 bg-transparent border-none outline-none text-white pr-4 font-bold" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ALL_COUNTRIES } from '@entities/country/model'
const emit = defineEmits(['select']); const langStore = useLangStore()
const searchQuery = ref(''); const isFocused = ref(false)

const filteredCountries = computed(() => {
  if (!searchQuery.value) return []
  const q = searchQuery.value.toLowerCase().trim()
  // ИЩЕМ ПО ВСЕМ СТРАНАМ
  return ALL_COUNTRIES.filter(c =>
      c.names.ru.toLowerCase().includes(q) ||
      c.names.en.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
  )
})

const selectCountry = (id: string) => { emit('select', id); searchQuery.value = '' }
</script>