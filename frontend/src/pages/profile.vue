<template>
  <div class="w-full h-full p-8 md:p-16 overflow-y-auto custom-scrollbar font-sans bg-[var(--bg-main)] text-white">
    <header class="flex justify-between items-end mb-16">
      <div class="flex items-center gap-10">
        <div class="relative">
          <div v-if="userStore.activeHat" class="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl z-10 drop-shadow-2xl">{{ userStore.activeHat }}</div>
          <div class="w-40 h-40 rounded-[60px] bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-8xl font-black italic relative z-0" :class="userStore.isVip ? 'border-yellow-500 shadow-[0_0_50px_rgba(251,191,36,0.2)]' : ''">
            {{ userStore.userName.charAt(0).toUpperCase() }}
          </div>
          <div v-if="userStore.activeEmoji" class="absolute -bottom-2 -right-2 w-14 h-14 rounded-full bg-black border border-white/10 flex items-center justify-center text-3xl shadow-2xl">{{ userStore.activeEmoji }}</div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-4">
              <input v-if="isEditingName" v-model="newName" @keyup.enter="saveName" class="bg-white/5 border border-[var(--ui-accent)] text-4xl font-black uppercase italic outline-none px-4 py-1 rounded-xl text-white w-64" />
              <h1 v-else class="text-6xl font-black uppercase italic tracking-tighter leading-none">{{ userStore.userName }}</h1>
              <button @click="isEditingName ? saveName() : (isEditingName = true)" class="w-10 h-10 rounded-xl bg-white/5 border-none cursor-pointer text-xl hover:bg-white/10 transition-all">
                {{ isEditingName ? '✅' : '✏️' }}
              </button>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-xs font-mono uppercase text-[var(--ui-accent)] opacity-50 italic">Node ID_{{ userStore.user?.id }}</span>
              <span v-if="userStore.isVip" class="px-3 py-1 bg-yellow-500 text-black text-[9px] font-black uppercase rounded-full tracking-tighter">VIP Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-col gap-12">
      <div v-for="cat in ['themes', 'profile', 'hats']" :key="cat" class="flex flex-col gap-6">
        <h3 class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 italic flex items-center gap-4">
          <span class="w-12 h-[1px] bg-white/10"></span> {{ langStore.t.leaderboard[cat] || cat }}
        </h3>
        <div class="flex flex-wrap gap-4">
          <div v-for="item in getInventoryByCategory(cat)" :key="item.item_id"
               class="p-6 rounded-[32px] bg-white/[0.03] border border-white/5 flex flex-col items-center gap-4 min-w-[120px]">
            <span class="text-4xl">{{ cat === 'themes' ? '🎨' : item.item_id }}</span>
            <span class="text-[10px] font-bold opacity-40 uppercase">{{ item.item_id }}</span>
          </div>
          <div v-if="getInventoryByCategory(cat).length === 0" class="text-[10px] italic text-white/10 uppercase tracking-widest ml-4">Empty Slot...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/entities/user/model/userStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'

const userStore = useUserStore()
const langStore = useLangStore()

const isEditingName = ref(false)
const newName = ref(userStore.userName)

const getInventoryByCategory = (type: string) => {
  return userStore.user?.inventory?.filter((i: any) => i.item_type === type) || []
}

const saveName = async () => {
  if (newName.value === userStore.userName) { isEditingName.value = false; return }
  if (newName.value.length < 3) return alert('Min 3 chars')
  const res = await userStore.changeUsername(newName.value)
  if (res.success) isEditingName.value = false
  else alert(res.message || 'Error')
}
</script>