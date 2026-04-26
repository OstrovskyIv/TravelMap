<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 scale-95">
    <div v-if="uiStore.isVipModalOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-8 backdrop-blur-2xl bg-black/60 font-sans" @click.self="uiStore.isVipModalOpen = false">
      <div class="w-full max-w-lg p-12 rounded-[48px] bg-zinc-900 border border-yellow-500/20 shadow-2xl flex flex-col items-center gap-8 relative overflow-hidden">
        <div class="flex flex-col items-center gap-2">
          <h2 class="text-4xl font-black text-white italic uppercase tracking-tighter">{{ langStore.t.vip.title }}</h2>
          <p class="text-[10px] text-white/30 uppercase font-mono tracking-[0.4em]">{{ langStore.t.vip.subtitle }}</p>
        </div>
        <div class="w-full flex flex-col gap-4">
          <div v-for="feat in features" :key="feat" class="flex justify-between items-center p-5 rounded-2xl bg-white/5 border border-white/5 italic">
            <span class="text-[10px] font-bold text-white/50 uppercase tracking-widest">{{ feat }}</span>
            <span class="text-yellow-500 text-xs">✓</span>
          </div>
        </div>
        <button @click="handleBuy" class="w-full py-5 rounded-2xl bg-yellow-500 text-black text-[11px] font-black uppercase tracking-[0.3em] border-none cursor-pointer hover:scale-105 transition-all shadow-lg shadow-yellow-500/20 italic">{{ langStore.t.vip.buyBtn }}</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const uiStore = useUiStore(); const userStore = useUserStore(); const langStore = useLangStore()
const features = computed(() => [
  langStore.t.vip.photoLimit + ": 100",
  langStore.t.vip.posts + ": Active",
  "Global Registry Pass"
])
const handleBuy = () => { userStore.buyVip(); uiStore.isVipModalOpen = false }
</script>