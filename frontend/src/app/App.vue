<template>
  <div
      class="h-screen w-screen overflow-hidden font-sans relative transition-colors duration-1000 bg-[var(--bg-main)]"
      :style="themeVars"
  >
    <AuthModal />

    <template v-if="userStore.token">
      <div class="absolute inset-0 z-10 w-full h-full">
        <RouterView />
      </div>

      <MenuToggle />
      <MainSidebar />
      <AdminConsole />
      <VipModal />
      <GamesModal />
    </template>
  </div>
</template>

<script setup lang="ts">
import { mapThemeToCssVars } from '@entities/map/lib/themeMapper'
import MenuToggle from '@/features/navigation/ui/MenuToggle.vue'
import VipModal from '@shared/ui/vip-modal/VipModal.vue'
import GamesModal from '@widgets/games-modal/GamesModal.vue'
import AuthModal from '@/features/auth/AuthModal.vue'
import { useMapStore } from '@entities/map/model/mapStore'
import { useUserStore } from '@entities/user/model/userStore'
import { computed } from 'vue'

const mapStore = useMapStore()
const userStore = useUserStore()

const themeVars = computed(() => {
  if (!mapStore.currentTheme) return {}
  return mapThemeToCssVars(mapStore.currentTheme)
})
</script>