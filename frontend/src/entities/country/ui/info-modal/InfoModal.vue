<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 scale-95" leave-active-class="transition-all duration-200 ease-in" leave-to-class="opacity-0 scale-95">
    <div v-if="uiStore.isInfoModalOpen && country" class="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8 backdrop-blur-md bg-black/80 font-sans" @click.self="uiStore.closeAllModals()">
      <div class="w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden rounded-[48px] border shadow-2xl bg-[var(--modal-bg)] border-[var(--ui-accent)]/20 text-white">

        <header class="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02] shrink-0">
          <div class="flex items-center gap-6">
            <span class="text-7xl">{{ activeCity ? '🏙️' : country.flag }}</span>
            <div class="flex flex-col">
              <h2 class="text-4xl font-black italic leading-none">{{ activeCity ? activeCity.names[langStore.currentLang] : country.names[langStore.currentLang] }}</h2>
              <span class="text-[10px] font-mono text-[var(--ui-accent)] uppercase mt-2">
                   {{ activeCity ? langStore.t.leaderboard.cities : langStore.t.leaderboard.countries }} // Node_{{ country.id }}
                </span>
            </div>
          </div>

          <div class="flex gap-4">
            <button v-if="activeCity" @click="activeCity = null" class="px-6 py-3 rounded-2xl bg-white/5 text-[11px] font-black uppercase tracking-widest border-none cursor-pointer hover:bg-white/10 transition-all italic text-white/60">
              ← {{ langStore.t.info.back }}
            </button>
            <button @click="uiStore.closeAllModals()" class="w-14 h-14 rounded-2xl bg-white/5 border-none text-white text-2xl cursor-pointer hover:bg-white/10 transition-all flex items-center justify-center">✕</button>
          </div>
        </header>

        <nav class="flex gap-3 px-8 py-4 bg-white/[0.01] shrink-0">
          <button v-for="tab in availableTabs" :key="tab.id" @click="activeTab = tab.id"
                  class="px-6 py-3 rounded-2xl text-[11px] font-black uppercase border-none cursor-pointer transition-all"
                  :class="activeTab === tab.id ? 'bg-[var(--ui-accent)] text-black shadow-lg' : 'bg-white/5 text-white/40'">
            {{ tab.label }}
          </button>
        </nav>

        <div class="flex-1 overflow-hidden flex flex-col relative bg-black/10">

          <div v-if="activeTab === 'summary'" class="flex-1 overflow-y-auto p-10 grid grid-cols-2 gap-6 custom-scrollbar">
            <div v-for="c in (activeCity ? ['interest', 'cleanliness', 'friendliness', 'infrastructure'] : ['interest', 'cleanliness', 'friendliness', 'difficulty'])" :key="c"
                 class="p-8 rounded-[40px] bg-white/[0.03] border border-white/5">
              <div class="flex justify-between items-center mb-6">
                <span class="text-xs font-black uppercase opacity-40 italic">{{ langStore.t.info[c] || c }}</span>
                <span class="text-4xl font-black italic text-[var(--ui-accent)]">{{ getRatingValue(c) }}</span>
              </div>
              <div class="flex gap-1 justify-between">
                <button v-for="n in 10" :key="n" @click="saveRating(c, n)"
                        class="flex-1 h-10 rounded-lg border-none cursor-pointer transition-all font-bold text-[10px]"
                        :class="n <= getRatingValue(c) ? 'bg-[var(--ui-accent)] text-black' : 'bg-white/5 text-white/20'">{{ n }}</button>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'discussion'" class="flex-1 flex flex-col overflow-hidden bg-[#050505]">
            <div class="p-4 border-b border-white/5 bg-black/20 shrink-0">
              <input v-model="chatSearch" :placeholder="langStore.t.info.searchPlaceholder" class="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-xs text-white outline-none focus:border-[var(--ui-accent)]/30" />
            </div>

            <div ref="chatContainer" class="flex-1 overflow-y-auto p-8 flex flex-col gap-6 custom-scrollbar bg-black">
              <div v-for="msg in filteredMessages" :key="msg.id" class="flex flex-col gap-2 max-w-[80%] group" :class="msg.author === userStore.userName ? 'self-end items-end' : 'self-start items-start'">
                <span class="text-[9px] font-black text-white/20 px-4 italic uppercase">{{ msg.author }}</span>
                <div class="p-5 rounded-[32px] bg-white/5 border border-white/10 relative transition-all group" :class="msg.author === userStore.userName ? 'border-[var(--ui-accent)]/30 rounded-tr-none' : 'rounded-tl-none'">
                  <div v-if="msg.reply_to" class="mb-3 p-3 bg-white/5 rounded-2xl border-l-4 border-[var(--ui-accent)] text-[10px] opacity-60">
                    <p class="font-black uppercase mb-1 text-[var(--ui-accent)]">{{ msg.reply_to.author }}</p>
                    <p class="truncate">{{ msg.reply_to.text || 'Media' }}</p>
                  </div>
                  <div class="absolute -right-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button @click="setReply(msg)" class="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xs">↩️</button>
                    <button v-for="e in ['🔥', '❤️', '👍']" :key="e" @click="addReaction(msg.id, e)" class="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-sm">{{ e }}</button>
                  </div>
                  <img v-if="msg.type === 'image'" :src="msg.media_url" class="max-w-sm rounded-2xl mb-4 border border-white/10 shadow-2xl" alt="Media" />
                  <p v-if="msg.caption" class="text-[10px] text-[var(--ui-accent)] font-black uppercase mb-2 italic"># {{ msg.caption }}</p>
                  <p v-if="msg.text" class="text-sm font-medium italic text-white/90 leading-relaxed">{{ msg.text }}</p>
                  <div class="flex gap-1.5 mt-3" v-if="msg.reactions && msg.reactions.length > 0">
                    <span v-for="(r, i) in msg.reactions" :key="i" class="px-2.5 py-1 rounded-xl bg-black/40 border border-white/5 text-[10px] font-black">{{ r.emoji }} {{ r.count }}</span>
                  </div>
                </div>
                <span class="text-[7px] font-mono opacity-20 px-4">{{ new Date(msg.timestamp).toLocaleTimeString() }}</span>
              </div>
            </div>

            <div v-if="replyingTo || pendingAttachment" class="p-4 bg-white/5 border-t border-white/10 flex flex-col gap-3 shrink-0">
              <div v-if="replyingTo" class="flex items-center justify-between">
                <div class="border-l-4 border-[var(--ui-accent)] pl-4">
                  <p class="text-[9px] font-black uppercase text-[var(--ui-accent)]">{{ langStore.t.info.reply }} {{ replyingTo.author }}</p>
                  <p class="text-xs opacity-40 truncate max-w-lg">{{ replyingTo.text || 'Media' }}</p>
                </div>
                <button @click="replyingTo = null" class="bg-transparent border-none text-white opacity-40 cursor-pointer">✕</button>
              </div>
              <div v-if="pendingAttachment" class="flex items-center gap-4">
                <div class="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--ui-accent)]">
                  <img :src="pendingAttachment.preview" class="w-full h-full object-cover" alt="Preview" />
                  <button @click="clearAttachment" class="absolute top-0 right-0 bg-black/80 w-5 h-5 text-[10px]">✕</button>
                </div>
                <span class="text-[9px] font-black uppercase text-[var(--ui-accent)]">{{ langStore.t.info.photoAttached }}</span>
              </div>
            </div>

            <div class="p-6 bg-black border-t border-white/5 flex gap-4 items-center shrink-0">
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileSelect" />
              <button @click="fileInput?.click()" class="w-14 h-14 rounded-2xl bg-white/5 text-xl hover:bg-white/10 cursor-pointer transition-all border-none">🖼️</button>
              <input v-model="newMsgText" @keyup.enter="handleSendMsg()" class="flex-1 bg-white/5 border border-white/10 rounded-2xl px-7 py-5 text-sm text-white outline-none focus:border-[var(--ui-accent)]/40 transition-all" :placeholder="langStore.t.info.sendMessage" />
              <button @click="handleSendMsg()" :disabled="cooldown > 0" class="w-16 h-14 rounded-2xl bg-[var(--ui-accent)] text-black border-none cursor-pointer">
                <span v-if="cooldown > 0">{{ cooldown }}s</span><span v-else>➤</span>
              </button>
            </div>
          </div>

          <div v-else-if="activeTab === 'gallery'" class="flex-1 overflow-y-auto p-10 custom-scrollbar bg-zinc-950">
            <div v-if="!activeAlbum" class="flex flex-col gap-10">
              <div class="flex gap-4 p-6 bg-white/5 rounded-3xl border border-white/10">
                <input v-model="newAlbumName" :placeholder="langStore.t.info.albumName" class="flex-1 bg-black/40 border border-white/10 p-4 rounded-xl text-white outline-none font-bold" />
                <button @click="handleCreateAlbum" class="bg-[var(--ui-accent)] text-black px-8 rounded-xl font-black uppercase text-xs">{{ langStore.t.info.createAlbum }}</button>
              </div>
              <div class="grid grid-cols-3 gap-6">
                <div v-for="album in cityAlbums" :key="album.id" @click="activeAlbum = album" class="aspect-square bg-white/5 rounded-[48px] p-8 flex flex-col justify-end relative cursor-pointer group hover:bg-white/10 transition-all">
                  <span class="text-4xl mb-4">📁</span><span class="text-xl font-black uppercase italic">{{ album.name }}</span>
                </div>
              </div>
            </div>
            <div v-else class="flex flex-col gap-8">
              <button @click="activeAlbum = null" class="w-fit text-[10px] font-black uppercase text-[var(--ui-accent)] border-none bg-transparent cursor-pointer">← {{ langStore.t.info.back }}</button>
              <div class="grid grid-cols-4 gap-4">
                <div v-for="photo in activeAlbum.photos" :key="photo.id" class="aspect-square rounded-3xl overflow-hidden border border-white/10 relative group shadow-2xl">
                  <img :src="photo.media_url" class="w-full h-full object-cover" alt="Album photo" />
                  <div class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end"><p class="text-xs italic">{{ photo.caption }}</p></div>
                </div>
                <input type="file" ref="galleryFileInput" class="hidden" accept="image/*" @change="handleGalleryUpload" />
                <button @click="galleryFileInput?.click()" class="aspect-square rounded-3xl border-2 border-dashed border-white/10 flex items-center justify-center text-3xl text-white/20 hover:text-white transition-all">+</button>
              </div>
            </div>
          </div>

          <div v-else-if="activeTab === 'cities'" class="flex-1 overflow-y-auto p-10 flex flex-col gap-6 custom-scrollbar bg-zinc-950">
            <input v-model="citySearchInput" :placeholder="langStore.t.search.placeholder" class="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-xs text-white outline-none focus:border-[var(--ui-accent)]/30" />
            <div class="grid grid-cols-1 gap-3 pb-10">
              <div v-for="city in filteredCitiesList" :key="city.id" class="p-6 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                <div @click="activeCity = city; activeTab = 'summary'" class="flex items-center gap-6 cursor-pointer">
                  <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-xs text-white/20 italic">CITY</div>
                  <span class="text-xl font-black uppercase italic leading-none">{{ city.names[langStore.currentLang] }}</span>
                </div>
                <button @click="mapStore.toggleCityVisit(country.id, city.id)" class="px-8 py-3 rounded-2xl font-black text-[10px]" :class="mapStore.isCityVisited(country.id, city.id) ? 'bg-green-500/20 text-green-400' : 'bg-[var(--ui-accent)] text-black shadow-lg transition-all'">{{ mapStore.isCityVisited(country.id, city.id) ? langStore.t.info.visited : langStore.t.info.visitBtn }}</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ALL_COUNTRIES } from '@entities/country/model'; import api from '@shared/api'; import { ref, computed, watch, nextTick } from 'vue'
import { useUiStore } from '@shared/lib/uiStore'; import { useMapStore } from '@entities/map/model/mapStore'
import { useLangStore } from '@features/lang-switcher/model/langStore'; import { useUserStore } from '@entities/user/model/userStore'

const uiStore = useUiStore(); const mapStore = useMapStore(); const langStore = useLangStore(); const userStore = useUserStore()
const country = computed(() => ALL_COUNTRIES.find(c => c.id === mapStore.pendingCountryId))
const activeCity = ref<any>(null); const activeTab = ref('summary'); const newMsgText = ref('')
const serverMessages = ref<any[]>([]); const chatSearch = ref(''); const chatContainer = ref<HTMLElement | null>(null)
const cityAlbums = ref<any[]>([]); const activeAlbum = ref<any>(null); const cooldown = ref(0); const fileInput = ref<HTMLInputElement | null>(null)
const galleryFileInput = ref<HTMLInputElement | null>(null); const cityRating = ref<any>({}); const replyingTo = ref<any>(null)
const pendingAttachment = ref<{ file: File, preview: string } | null>(null); const newAlbumName = ref(''); const citySearchInput = ref('')

const fetchChat = async () => {
  const id = country.value?.id; if (!id) return
  const { data } = await api.get(`/map/chat/${id}`); serverMessages.value = data; await scrollToBottom()
}
const scrollToBottom = async () => { await nextTick(); if (chatContainer.value) chatContainer.value.scrollTop = chatContainer.value.scrollHeight }

const handleSendMsg = async () => {
  if (cooldown.value > 0) return
  let finalMedia = null; let finalCaption = null; let finalType = 'text'; let finalText = newMsgText.value
  if (pendingAttachment.value) {
    const fd = new FormData(); fd.append('image', pendingAttachment.value.file)
    const { data } = await api.post('/map/upload', fd); finalMedia = data.url; finalType = 'image'; finalCaption = newMsgText.value; finalText = ''
  }
  await api.post('/map/chat', { targetId: country.value?.id, text: finalText, type: finalType, media_url: finalMedia, caption: finalCaption, replyToId: replyingTo.value?.id })
  newMsgText.value = ''; replyingTo.value = null; clearAttachment(); cooldown.value = 3; await fetchChat(); startCooldown()
}
const handleFileSelect = (e: any) => { const f = e.target.files[0]; if (f) pendingAttachment.value = { file: f, preview: URL.createObjectURL(f) } }
const clearAttachment = () => { if (pendingAttachment.value) URL.revokeObjectURL(pendingAttachment.value.preview); pendingAttachment.value = null; if (fileInput.value) fileInput.value.value = '' }
const setReply = (msg: any) => { replyingTo.value = msg; activeTab.value = 'discussion' }
const startCooldown = () => { const t = setInterval(() => { cooldown.value--; if (cooldown.value <= 0) clearInterval(t) }, 1000) }
const getRatingValue = (key: string) => activeCity.value ? (cityRating.value[key] || 0) : (mapStore.countryRatings[country.value!.id]?.[key] || 0)
const saveRating = async (key: string, n: number) => {
  if (activeCity.value) { cityRating.value[key] = n; await api.post('/map/city/rating', { cityId: activeCity.value.id, ...cityRating.value }) }
  else { const r = { ...mapStore.countryRatings[country.value!.id], [key]: n }; await mapStore.saveCountryRating(country.value!.id, r) }
}
const fetchCityData = async () => {
  if (!activeCity.value) return
  const { data } = await api.get(`/map/city/data/${activeCity.value.id}`); cityRating.value = data.rating; cityAlbums.value = data.albums
  if (activeAlbum.value) activeAlbum.value = data.albums.find((a: any) => a.id === activeAlbum.value.id)
}
const handleGalleryUpload = async (e: any) => {
  const f = e.target.files[0]; if (!f || !activeAlbum.value) return
  const cap = prompt(langStore.t.info.addCaption); const fd = new FormData(); fd.append('image', f)
  const { data } = await api.post('/map/upload', fd)
  await api.post('/map/chat', { targetId: activeCity.value.id, type: 'image', media_url: data.url, caption: cap, albumId: activeAlbum.value.id })
  await fetchCityData()
}
const handleCreateAlbum = async () => { if (newAlbumName.value) { await api.post('/map/city/album', { cityId: activeCity.value.id, name: newAlbumName.value }); newAlbumName.value = ''; await fetchCityData() } }
const addReaction = async (mId: number, emoji: string) => { await api.post('/map/chat/reaction', { messageId: mId, emoji }); await fetchChat() }
const availableTabs = computed(() => activeCity.value ? [{ id: 'summary', label: 'Overview' }, { id: 'gallery', label: 'Gallery' }] : [{ id: 'summary', label: 'Summary' }, { id: 'cities', label: 'Cities' }, { id: 'discussion', label: 'Discussion' }])
const filteredMessages = computed(() => serverMessages.value.filter(m => (m.text && m.text.toLowerCase().includes(chatSearch.value.toLowerCase())) || (m.caption && m.caption.toLowerCase().includes(chatSearch.value.toLowerCase()))))
const filteredCitiesList = computed(() => country.value ? country.value.cities.filter(c => c.names[langStore.currentLang].toLowerCase().includes(citySearchInput.value.toLowerCase())) : [])
watch([activeTab, activeCity, () => uiStore.isInfoModalOpen], async () => { if (uiStore.isInfoModalOpen) { if (activeTab.value === 'discussion') await fetchChat(); if (activeCity.value) await fetchCityData() } })
watch(() => mapStore.pendingCountryId, () => { activeTab.value = 'summary'; activeCity.value = null; serverMessages.value = []; replyingTo.value = null })
</script>