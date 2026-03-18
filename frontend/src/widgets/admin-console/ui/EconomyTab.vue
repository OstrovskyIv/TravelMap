<template>
  <div class="w-full h-full p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar text-white">

    <div class="w-full flex flex-col shadow-2xl rounded-[32px] overflow-hidden shrink-0 transition-all">
      <div class="bg-blue-600 px-6 py-4 flex flex-wrap justify-between items-center gap-3">
        <div class="flex flex-col">
          <span class="text-[8px] font-black uppercase tracking-[0.3em] text-white/70 leading-none">Aviation Control Registry</span>
          <span class="text-xs font-bold text-white">System Terminal v.1.0</span>
        </div>
        <div class="px-2 py-1 rounded bg-black/20 border border-white/10 text-[8px] font-black text-white uppercase tracking-tighter">Admin Access</div>
      </div>

      <div class="bg-white flex flex-col md:flex-row relative text-slate-900">
        <div class="hidden sm:flex bg-slate-50 px-3 py-6 items-center justify-center border-r border-slate-100 shrink-0">
          <span class="[writing-mode:vertical-lr] rotate-180 text-[7px] font-black uppercase tracking-[0.5em] text-slate-300">Authority Pass</span>
        </div>

        <div class="flex-1 p-6 flex flex-wrap justify-between items-center gap-6">
          <div class="flex flex-col gap-4 min-w-[200px]">
            <div class="flex flex-col">
              <span class="text-[8px] font-black uppercase text-slate-400 tracking-[0.3em]">Total Miles</span>
              <div class="flex items-baseline gap-2">
                <span class="text-5xl lg:text-7xl font-black tracking-tighter">{{ userStore.balance }}</span>
                <span class="text-lg font-black text-blue-600 uppercase italic">Miles</span>
              </div>
            </div>
            <div class="hidden lg:flex flex-col gap-1.5 opacity-90">
              <div class="h-8 w-48 bg-[repeating-linear-gradient(90deg,#111827,#111827_2px,#fff_2px,#fff_4px)]"></div>
              <span class="text-[7px] font-mono text-slate-400 uppercase italic">AUTH: 009-X-TERMINAL</span>
            </div>
          </div>

          <div class="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-8">
            <div class="flex flex-col items-center gap-1">
              <span class="text-[8px] font-black text-slate-300 uppercase leading-none">Status</span>
              <div class="w-10 h-10 rounded-full border-4 border-blue-500 flex items-center justify-center">
                <span class="text-[9px] font-black text-blue-600">VIP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="userStore.balance = 0" class="bg-slate-50 py-3 text-[8px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border-t border-slate-100 outline-none">Terminate and Wipe Registry</button>
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full pb-10">
      <div class="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col gap-4">
        <span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 leading-none">Quick Injection</span>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button v-for="n in [100, 500, -100, -500]" :key="n" @click="userStore.addBalance(n)"
                  class="py-3 rounded-xl font-black text-[10px] transition-all border-none cursor-pointer"
                  :class="n > 0 ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'">
            {{ n > 0 ? '+' : '' }}{{ n }}
          </button>
        </div>
      </div>

      <div class="p-6 bg-white/5 border border-white/10 rounded-[32px] flex flex-col gap-4">
        <span class="text-[9px] font-black uppercase tracking-[0.2em] opacity-30 leading-none">Manual Registry Overwrite</span>
        <div class="flex gap-2">
          <input v-model="customBalance" type="number" class="flex-1 min-w-0 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-blue-500 transition-all" placeholder="Balance..." />
          <button @click="setExactBalance" class="px-4 py-3 rounded-xl bg-blue-600 text-white font-black text-[10px] uppercase hover:bg-blue-500 active:scale-95 transition-all shadow-lg border-none shrink-0">SYNC</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const customBalance = ref<number | null>(null)
const setExactBalance = () => {
  if (customBalance.value !== null) {
    userStore.balance = Math.max(0, customBalance.value)
    customBalance.value = null
  }
}
</script>