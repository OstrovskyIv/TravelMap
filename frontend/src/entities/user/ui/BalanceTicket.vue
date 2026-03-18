<template>
  <div class="flex overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-all duration-500 hover:scale-[1.02] group">
    <div class="bg-blue-600 px-3 py-6 flex items-center justify-center border-r border-white/10 shrink-0">
      <span class="[writing-mode:vertical-lr] rotate-180 text-[7px] font-black uppercase tracking-[0.4em] text-white/70">Boarding Pass</span>
    </div>

    <div class="bg-white px-10 py-6 flex flex-col items-center justify-center gap-1 min-w-[160px]">
      <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.2em] leading-none">Wallet Balance</span>
      <div class="flex items-baseline gap-1">
        <span class="text-5xl font-black text-slate-900 leading-none tracking-tighter">{{ userStore.balance }}</span>
        <span class="text-[10px] font-black text-blue-500 uppercase italic">Miles</span>
      </div>
      <span class="text-[7px] font-bold text-slate-300 uppercase tracking-widest mt-1">Verified Registry</span>
    </div>

    <div class="relative w-[2px] bg-white flex flex-col justify-center">
      <div class="absolute -top-2 -left-[7px] w-4 h-4 bg-black/40 rounded-full"></div>
      <div class="h-full border-l-2 border-dashed border-slate-200 mx-auto"></div>
      <div class="absolute -bottom-2 -left-[7px] w-4 h-4 bg-black/40 rounded-full"></div>
    </div>

    <div class="bg-white px-8 py-6 flex flex-col justify-between items-end gap-3 shrink-0">
      <div class="flex flex-col items-end gap-0.5">
        <span class="text-[7px] font-black text-slate-300 uppercase leading-none">Flight</span>
        <span class="text-xs font-black text-slate-800 leading-none tracking-tighter">TM-{{ new Date().getFullYear() }}</span>
      </div>
      <div class="flex flex-col items-end gap-0.5">
        <span class="text-[7px] font-black text-slate-300 uppercase leading-none">Date</span>
        <span class="text-xs font-black text-slate-800 leading-none tracking-tighter">{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const formattedDate = computed(() => {
  const date = new Date()
  return `${date.getDate()} ${date.toLocaleString('en-US', { month: 'short' }).toUpperCase()}`
})
</script>