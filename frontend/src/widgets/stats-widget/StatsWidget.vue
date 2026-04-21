<template>
  <div
      class="flex flex-col gap-2 p-8 backdrop-blur-3xl transition-all duration-500 rounded-[40px] border shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[var(--sidebar-bg)]/80 border-[var(--ui-accent)]/20"
  >
    <span class="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--ui-accent)]">
      {{ langStore.t.stats.log }}
    </span>

    <div class="flex items-baseline gap-3">
      <span class="text-5xl font-black text-white leading-none tracking-tighter">
        {{ store.visited.length }}
      </span>
      <span class="text-[11px] text-white/40 font-bold uppercase tracking-widest leading-none">
        {{ langStore.t.stats.regions }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const store = useMapStore()
const langStore = useLangStore()
</script>