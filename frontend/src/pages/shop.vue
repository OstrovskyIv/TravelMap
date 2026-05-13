<template>
  <div class="w-full h-full p-12 flex flex-col gap-16 overflow-y-auto custom-scrollbar font-sans bg-[var(--bg-main)] text-white">
    <header class="flex justify-between items-start">
      <div class="flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-7xl font-black uppercase tracking-tighter italic leading-none">{{ langStore.t.shop.title }}</h1>
          <span class="text-xs font-mono uppercase tracking-[0.5em] opacity-40 italic">{{ langStore.t.shop.subtitle }}</span>
        </div>
        <nav class="flex gap-3">
          <button v-for="tab in shopTabs" :key="tab.id" @click="activeTab = tab.id"
                  class="px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border-none cursor-pointer transition-all italic"
                  :class="activeTab === tab.id ? 'bg-white text-black shadow-lg shadow-white/10' : 'bg-white/5 text-white/40 hover:bg-white/10'">
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div class="w-80 flex flex-col shadow-2xl rounded-[32px] overflow-hidden shrink-0 border border-white/5 font-sans">
        <div class="bg-blue-600 px-6 py-4 flex justify-between items-center text-white">
          <span class="text-[8px] font-black uppercase tracking-[0.3em] opacity-70 italic">Aviation Registry</span>
          <div class="px-2 py-0.5 rounded bg-black/20 text-[7px] font-black uppercase italic">Personal</div>
        </div>
        <div class="bg-white p-7 flex flex-col gap-1">
          <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.3em] leading-none mb-1">{{ langStore.t.admin.totalMiles }}</span>
          <div class="flex items-baseline gap-2 text-slate-900 leading-none">
            <span class="text-6xl font-black tracking-tighter">{{ userStore.balance }}</span>
            <span class="text-sm font-black text-blue-600 uppercase italic">CR</span>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-col gap-20 pb-20">
      <!-- Секция: Куплено -->
      <section v-if="purchasedItems.length > 0" class="flex flex-col gap-10">
        <h2 class="text-xs font-black uppercase tracking-[0.5em] text-white/20 italic flex items-center gap-4">
          <span class="w-12 h-[1px] bg-white/10"></span>
          {{ langStore.currentLang === 'ru' ? 'В коллекции' : 'Purchased' }}
        </h2>
        <div :class="activeTab === 'themes' ? 'grid grid-cols-3 gap-8' : 'grid grid-cols-5 gap-6'">
          <div v-for="item in purchasedItems" :key="item.id" class="p-8 rounded-[40px] border border-white/5 bg-white/[0.02] flex flex-col items-center gap-6 group hover:bg-white/[0.04] transition-all">
            <span v-if="item.type !== 'themes'" class="text-5xl drop-shadow-2xl group-hover:scale-110 transition-transform">{{ item.display }}</span>
            <div v-else class="flex flex-col items-center text-center gap-1">
              <span class="text-xl font-black uppercase italic text-white">{{ item.title }}</span>
              <span class="text-[8px] font-mono opacity-20 uppercase tracking-widest">{{ item.id }}</span>
            </div>
            <button @click="handleEquip(item)"
                    class="w-full py-4 rounded-2xl text-[9px] font-black uppercase italic border-none cursor-pointer transition-all"
                    :class="isEquipped(item) ? 'bg-[var(--ui-accent)] text-black shadow-lg shadow-[var(--ui-accent)]/20' : 'bg-white/5 text-white/60 hover:bg-white/10'">
              {{ isEquipped(item) ? 'Active' : 'Equip' }}
            </button>
          </div>
        </div>
      </section>

      <!-- Секция: Доступно -->
      <section v-if="availableItems.length > 0" class="flex flex-col gap-10">
        <h2 class="text-xs font-black uppercase tracking-[0.5em] text-white/20 italic flex items-center gap-4">
          <span class="w-12 h-[1px] bg-white/10"></span>
          {{ langStore.currentLang === 'ru' ? 'Доступно' : 'Available' }}
        </h2>
        <div :class="activeTab === 'themes' ? 'grid grid-cols-3 gap-8' : 'grid grid-cols-5 gap-6'">
          <div v-for="item in availableItems" :key="item.id" class="p-8 rounded-[40px] border border-white/5 bg-black/20 flex flex-col items-center gap-6">
            <span v-if="item.type !== 'themes'" class="text-5xl opacity-40">{{ item.display }}</span>
            <div v-else class="flex flex-col items-center text-center gap-1">
              <span class="text-xl font-black uppercase italic opacity-40 text-white">{{ item.title }}</span>
              <span class="text-[8px] font-mono opacity-10 uppercase tracking-widest italic">Price: {{ item.price }}</span>
            </div>
            <button @click="handleBuy(item)" :disabled="userStore.balance < item.price"
                    class="w-full py-4 rounded-2xl text-[9px] font-black uppercase italic border-none cursor-pointer transition-all"
                    :class="userStore.balance >= item.price ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:scale-105' : 'bg-white/5 text-white/10 cursor-not-allowed'">
              {{ item.price }} Credits
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import api from '@shared/api'
import { useMapStore } from '@entities/map/model/mapStore'
import { useUserStore } from '@entities/user/model/userStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'
import { ref, computed } from 'vue'

const mapStore = useMapStore()
const langStore = useLangStore()
const userStore = useUserStore()

type TabType = 'themes' | 'profile' | 'hats'

interface ShopItem {
  id: string
  title: string
  display: string
  price: number
  type: TabType
}

const activeTab = ref<TabType>('themes')

const shopTabs = computed<{ id: TabType, label: string }[]>(() => [
  { id: 'themes', label: langStore.currentLang === 'ru' ? 'Темы карты' : 'Map Themes' },
  { id: 'profile', label: langStore.currentLang === 'ru' ? 'Иконки' : 'Icons' },
  { id: 'hats', label: langStore.currentLang === 'ru' ? 'Шляпы' : 'Hats' }
])

const emojiItems = [
  { id: 'e1', val: '🚀', price: 100 },
  { id: 'e2', val: '🏔️', price: 150 },
  { id: 'e3', val: '🏝️', price: 200 },
  { id: 'e4', val: '⛩️', price: 250 },
  { id: 'e5', val: '🗼', price: 300 }
]

const hatItems = [
  { id: 'h1', val: '🎩', price: 500 },
  { id: 'h2', val: '👑', price: 1000 },
  { id: 'h3', val: '🎓', price: 400 },
  { id: 'h4', val: '🤠', price: 350 },
  { id: 'h5', val: '⛑️', price: 300 }
]

const allItems = computed<ShopItem[]>(() => {
  if (activeTab.value === 'themes') {
    return Object.values(mapStore.themes).map(t => ({
      id: t.id, title: t.name, display: '', price: t.price || 0, type: 'themes'
    }))
  }
  if (activeTab.value === 'profile') {
    return emojiItems.map(e => ({ id: e.id, title: '', display: e.val, price: e.price, type: 'profile' }))
  }
  if (activeTab.value === 'hats') {
    return hatItems.map(h => ({ id: h.id, title: '', display: h.val, price: h.price, type: 'hats' }))
  }
  return []
})

const purchasedItems = computed(() => {
  return allItems.value.filter(item => {
    if (item.type === 'themes') return userStore.purchasedThemes.includes(item.id)
    if (item.type === 'profile') return userStore.purchasedEmojis.includes(item.display)
    if (item.type === 'hats') return userStore.purchasedHats.includes(item.display)
    return false
  })
})

const availableItems = computed(() => {
  return allItems.value.filter(item => {
    const isPurchased = (item.type === 'themes' && userStore.purchasedThemes.includes(item.id)) ||
        (item.type === 'profile' && userStore.purchasedEmojis.includes(item.display)) ||
        (item.type === 'hats' && userStore.purchasedHats.includes(item.display))
    return !isPurchased
  })
})

const isEquipped = (item: ShopItem) => {
  if (item.type === 'themes') return mapStore.currentThemeId === item.id
  if (item.type === 'profile') return userStore.activeEmoji === item.display
  if (item.type === 'hats') return userStore.activeHat === item.display
  return false
}

const handleEquip = async (item: ShopItem) => {
  try {
    if (item.type === 'themes') {
      mapStore.setTheme(item.id)
    } else {
      // Сохраняем выбор в БД
      await api.post('/economy/equip', { itemId: item.display, itemType: item.type })
      // Обновляем данные пользователя в приложении
      await userStore.fetchProfile()
    }
  } catch (e) {
    console.error('Equip failed', e)
  }
}

const handleBuy = async (item: ShopItem) => {
  try {
    const itemId = item.type === 'themes' ? item.id : item.display
    await api.post('/economy/buy', {
      itemId,
      itemType: item.type,
      price: item.price
    })

    // После покупки обновляем профиль, чтобы подтянуть новый инвентарь и баланс
    await userStore.fetchProfile()

    alert('Purchased successfully!')
  } catch (e: any) {
    alert(e.response?.data?.message || 'Transaction failed')
  }
}
</script>