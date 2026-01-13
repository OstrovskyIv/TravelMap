<template>
  <div class="w-full h-full flex flex-col gap-10 p-12 overflow-y-auto font-sans">
    <header class="flex flex-col gap-2">
      <h1 class="text-5xl font-black uppercase tracking-tighter text-white">
        Control Center
      </h1>
      <span class="text-blue-500 font-mono text-sm uppercase tracking-[0.5em]">Administrator Access Only</span>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Заглушки -->
      <div v-for="i in 3" :key="i" class="p-8 bg-white/5 border border-white/10 rounded-[32px] flex flex-col gap-4 backdrop-blur-xl">
        <div class="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-500 font-bold">
          0{{ i }}
        </div>
        <h3 class="text-xl font-bold text-white">Admin Module</h3>
        <p class="text-sm text-white/40 leading-relaxed">Future tool for managing countries, users and map database settings.</p>
      </div>
    </div>
  </div>
</template>