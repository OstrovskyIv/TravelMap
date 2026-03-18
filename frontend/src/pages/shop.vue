<template>
  <div class="w-full h-full p-12 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans transition-colors duration-1000" :style="{ backgroundColor: mapStore.currentTheme?.background }">
    <header class="flex justify-between items-center">
      <div class="flex flex-col gap-2 text-white">
        <h1 class="text-7xl font-black uppercase tracking-tighter italic leading-none">
          {{ langStore.currentLang === 'ru' ? 'Магазин' : 'Style Shop' }}
        </h1>
        <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40">Visual Engine Marketplace</span>
      </div>
      <BalanceTicket />
    </header>

    <section class="flex flex-col gap-8">
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">{{ langStore.currentLang === 'ru' ? 'Твоя коллекция' : 'Your Collection' }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <button v-for="theme in ownedThemes" :key="theme.id" @click="mapStore.setTheme(theme.id)"
                class="p-10 rounded-[48px] border bg-white/5 transition-all hover:scale-[1.02] text-left outline-none"
                :style="{ borderColor: mapStore.currentThemeId === theme.id ? theme.colors.ui.accent : 'rgba(255,255,255,0.1)' }">
          <span class="text-2xl font-black uppercase text-white">{{ theme.name }}</span>
        </button>
      </div>
    </section>

    <section v-if="availableThemes.length > 0" class="flex flex-col gap-8">
      <h2 class="text-xs font-black uppercase tracking-[0.4em] text-white opacity-30">{{ langStore.currentLang === 'ru' ? 'Доступно' : 'Available' }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="theme in availableThemes" :key="theme.id" class="p-10 rounded-[48px] border border-white/5 bg-black/20 flex flex-col gap-6">
          <span class="text-2xl font-black uppercase text-white/40">{{ theme.name }}</span>
          <button @click="userStore.buyTheme(theme.id, theme.price || 0)"
                  :disabled="userStore.balance < (theme.price || 0)"
                  class="w-full py-4 rounded-xl font-black uppercase transition-all cursor-pointer border-none"
                  :class="userStore.balance >= (theme.price || 0) ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/20 cursor-not-allowed'">
            {{ theme.price }} 🎫
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const mapStore = useMapStore()
const langStore = useLangStore()
const userStore = useUserStore()

const themesList = computed(() => Object.values(mapStore.themes))
const ownedThemes = computed(() => themesList.value.filter(t => userStore.purchasedThemes.includes(t.id)))
const availableThemes = computed(() => themesList.value.filter(t => !userStore.purchasedThemes.includes(t.id)))
</script>