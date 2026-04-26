<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 scale-95">
    <div v-if="uiStore.isInfoModalOpen && country" class="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/80 font-sans" @click.self="uiStore.closeAllModals()">
      <div class="w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden rounded-[48px] border shadow-2xl bg-[var(--modal-bg)] border-[var(--ui-accent)]/20 text-white">

        <header class="p-8 border-b border-white/5 flex flex-col gap-6 shrink-0 bg-white/[0.02]">
          <div class="flex justify-between items-center text-white">
            <div class="flex items-center gap-6">
              <span class="text-6xl">{{ activeCity ? '🏙️' : country.flag }}</span>
              <div class="flex flex-col gap-1">
                <div class="flex items-center gap-4">
                  <h2 class="text-4xl font-black uppercase italic tracking-tighter leading-none">{{ activeCity ? activeCity.names[langStore.currentLang] : country.names[langStore.currentLang] }}</h2>
                  <div class="px-5 py-2 rounded-full bg-[var(--ui-accent)] text-black text-2xl font-black italic shadow-lg">
                    {{ activeCity ? mapStore.getCityRating(activeCity.id) : mapStore.getCountryScore(country.id, country.cities.map(c => c.id)) }}
                  </div>
                </div>
                <span class="text-[10px] font-mono text-[var(--ui-accent)] uppercase tracking-[0.4em] opacity-50">{{ activeCity ? 'Node' : 'Cluster' }} // Verified</span>
              </div>
            </div>
            <div class="flex gap-4">
              <button v-if="activeCity" @click="activeCity = null" class="px-6 py-3 rounded-2xl bg-white/5 text-[10px] font-black uppercase tracking-widest border-none cursor-pointer hover:bg-white/10 transition-all italic text-white/60">← {{ langStore.t.info.back }}</button>
              <button @click="uiStore.closeAllModals()" class="w-14 h-14 rounded-2xl bg-white/5 text-white/40 hover:text-white border-none cursor-pointer flex items-center justify-center text-2xl transition-all">✕</button>
            </div>
          </div>
          <nav class="flex gap-3">
            <button v-for="tab in availableTabs" :key="tab.id" @click="activeTab = tab.id" class="px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border-none cursor-pointer italic" :class="activeTab === tab.id ? 'bg-[var(--ui-accent)] text-black shadow-lg' : 'bg-white/5 text-white/40 hover:bg-white/10'">{{ tab.label }}</button>
          </nav>
        </header>

        <div class="flex-1 overflow-hidden flex flex-col relative bg-black/10">

          <div v-if="activeTab === 'summary'" class="flex-1 overflow-y-auto p-10 flex flex-col gap-12 custom-scrollbar">
            <div class="grid grid-cols-3 gap-6">
              <div v-for="(val, key) in (activeCity ? { type: 'Node Center', coords: `${activeCity.coords.lat}, ${activeCity.coords.lng}` } : country.stats)" :key="key" class="p-8 rounded-[32px] bg-white/[0.03] border border-white/5 flex flex-col gap-2">
                <span class="text-[10px] uppercase opacity-30 font-black tracking-[0.2em]">{{ key }}</span>
                <span class="text-xl font-black italic">{{ val }}</span>
              </div>
            </div>
            <section class="flex flex-col gap-8">
              <h3 class="text-xs font-black uppercase tracking-[0.5em] text-white/20 italic">{{ langStore.t.info.registry }}</h3>
              <div v-if="!activeCity" class="grid grid-cols-2 gap-6">
                <div v-for="criterion in ['interest', 'cleanliness', 'friendliness', 'difficulty']" :key="criterion" class="flex flex-col gap-4 p-7 rounded-3xl bg-white/[0.03] border border-white/5">
                  <div class="flex justify-between items-center">
                    <span class="text-[10px] font-black uppercase tracking-widest text-white/60">{{ langStore.t.info[criterion] }}</span>
                    <span class="text-2xl font-black text-[var(--ui-accent)] italic">{{ (mapStore.countryRatings[country.id] as any)?.[criterion] || 0 }}</span>
                  </div>
                  <input type="range" min="0" max="10" step="1" :value="(mapStore.countryRatings[country.id] as any)?.[criterion] || 0" @input="(e) => updateCountryRating(criterion, (e.target as HTMLInputElement).value)" class="w-full accent-[var(--ui-accent)]" />
                </div>
              </div>
              <div v-else class="p-10 rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center gap-8">
                <span class="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Node Rating</span>
                <div class="flex gap-3 flex-wrap justify-center">
                  <button v-for="n in 10" :key="n" @click="mapStore.setCityRating(activeCity.id, n)" class="w-12 h-12 rounded-xl flex items-center justify-center font-black transition-all cursor-pointer border-none" :class="n <= mapStore.getCityRating(activeCity.id) ? 'bg-[var(--ui-accent)] text-black shadow-lg scale-110' : 'bg-white/5 text-white/20 hover:bg-white/10'">{{ n }}</button>
                </div>
              </div>
            </section>
          </div>

          <div v-else-if="activeTab === 'memories'" class="flex-1 overflow-y-auto p-10 flex flex-col gap-10 custom-scrollbar">
            <div class="flex justify-between items-center bg-white/5 p-6 rounded-3xl border border-white/10">
              <input v-model="newAlbumName" class="bg-transparent border-none outline-none text-white text-sm font-bold w-1/2" :placeholder="langStore.t.info.albumName" />
              <button @click="handleCreateAlbum" class="px-8 py-3 rounded-xl bg-[var(--ui-accent)] text-black text-[10px] font-black uppercase italic border-none cursor-pointer hover:scale-105 transition-all">{{ langStore.t.info.createAlbum }}</button>
            </div>
            <div class="grid grid-cols-3 gap-6">
              <div v-for="album in currentAlbums" :key="album.id" class="group relative aspect-video rounded-[32px] overflow-hidden bg-white/5 border border-white/10 cursor-pointer">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div class="absolute bottom-6 left-6 flex flex-col">
                  <span class="text-xs font-black uppercase italic">{{ album.name }}</span>
                  <span class="text-[8px] opacity-40 font-mono">📸 {{ album.images.length }} Items</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'discussion'" class="flex-1 flex flex-col overflow-hidden">
            <div class="flex-1 overflow-y-auto p-8 flex flex-col gap-4 custom-scrollbar">
              <div v-for="msg in currentChat" :key="msg.id" class="flex flex-col gap-1 max-w-[80%]" :class="msg.author === userStore.userName ? 'self-end items-end' : 'self-start items-start'">
                <span class="text-[8px] font-black uppercase text-white/20 px-2 italic">{{ msg.author }}</span>
                <div class="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-sm font-medium italic" :class="msg.author === userStore.userName ? 'bg-[var(--ui-accent)]/10 border-[var(--ui-accent)]/20 text-white' : 'text-white/70'">
                  {{ msg.text }}
                </div>
                <span class="text-[7px] font-mono opacity-20 px-2">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
              </div>
            </div>
            <div class="p-6 bg-white/[0.02] border-t border-white/5 flex gap-4">
              <input v-model="newMsgText" @keyup.enter="handleSendMsg" class="flex-1 bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium text-white outline-none focus:border-[var(--ui-accent)]/40" :placeholder="langStore.t.info.sendMessage" />
              <button @click="handleSendMsg" class="w-14 h-14 rounded-2xl bg-[var(--ui-accent)] text-black border-none cursor-pointer flex items-center justify-center text-xl shadow-lg">➤</button>
            </div>
          </div>

          <div v-else-if="activeTab === 'cities'" class="flex-1 overflow-y-auto p-10 flex flex-col gap-8 custom-scrollbar">
            <input v-model="citySearch" class="w-full bg-white/5 border border-white/10 rounded-2xl px-7 py-5 text-xs font-bold outline-none focus:border-[var(--ui-accent)]/40 text-white italic" :placeholder="langStore.t.search.placeholder" />
            <div class="grid grid-cols-1 gap-3 pb-10">
              <div v-for="city in filteredCities" :key="city.id" class="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                <div class="flex items-center gap-6" @click="activeCity = city">
                  <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs text-white/20 italic group-hover:text-[var(--ui-accent)] transition-all">ID</div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs font-black uppercase tracking-widest group-hover:text-white transition-all cursor-pointer">{{ city.names[langStore.currentLang] }}</span>
                    <span v-if="city.isCapital" class="text-[7px] font-black text-[var(--ui-accent)] uppercase italic">Capital</span>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black text-xs italic">{{ mapStore.getCityRating(city.id) }}</div>
                  <button @click="mapStore.toggleCityVisit(country.id, city.id)" class="px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all border-none cursor-pointer" :class="mapStore.isCityVisited(country.id, city.id) ? 'bg-green-500/20 text-green-400' : 'bg-[var(--ui-accent)] text-black shadow-lg active:scale-95'">{{ mapStore.isCityVisited(country.id, city.id) ? langStore.t.info.visited : langStore.t.info.visitBtn }}</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ALL_COUNTRIES } from '@entities/country/model'
const uiStore = useUiStore(); const mapStore = useMapStore(); const langStore = useLangStore(); const userStore = useUserStore()
const country = computed(() => ALL_COUNTRIES.find(c => c.id === mapStore.pendingCountryId))
const activeCity = ref<any>(null); const activeTab = ref('summary'); const citySearch = ref(''); const newMsgText = ref(''); const newAlbumName = ref('')
const availableTabs = computed(() => {
  const t = [{ id: 'summary', label: langStore.t.info.summary }, { id: 'memories', label: langStore.t.info.memories }, { id: 'discussion', label: langStore.t.info.discussion }]
  if (!activeCity.value) t.push({ id: 'cities', label: langStore.t.info.cities })
  return t
})
const filteredCities = computed(() => country.value ? country.value.cities.filter(c => c.names[langStore.currentLang].toLowerCase().includes(citySearch.value.toLowerCase())) : [])
const currentChat = computed(() => {
  const id = activeCity.value?.id || country.value?.id
  return id ? (mapStore.publicChats[id] || []) : []
})
const currentAlbums = computed(() => {
  const id = activeCity.value?.id || country.value?.id
  return id ? (mapStore.personalAlbums[id] || []) : []
})
const handleSendMsg = () => {
  const id = activeCity.value?.id || country.value?.id
  if (!id || !newMsgText.value) return
  mapStore.addChatMessage(id, { id: Math.random().toString(), author: userStore.userName, text: newMsgText.value, timestamp: Date.now() })
  newMsgText.value = ''
}
const handleCreateAlbum = () => {
  const id = activeCity.value?.id || country.value?.id
  if (!id || !newAlbumName.value) return
  mapStore.addAlbum(id, { id: Math.random().toString(), name: newAlbumName.value, images: new Array(userStore.isVip ? 10 : 3).fill('img'), timestamp: Date.now() })
  newAlbumName.value = ''
}
const updateCountryRating = (key: string, val: string) => {
  if (!country.value) return
  const current = mapStore.countryRatings[country.value.id] || { interest: 0, cleanliness: 0, friendliness: 0, difficulty: 0 }
  mapStore.setCountryRating(country.value.id, { ...current, [key]: parseInt(val) })
}
watch(() => mapStore.pendingCountryId, () => { activeTab.value = 'summary'; activeCity.value = null })
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 3px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
input[type=range] { -webkit-appearance: none; background: rgba(255,255,255,0.1); height: 4px; border-radius: 2px; outline: none; }
</style>