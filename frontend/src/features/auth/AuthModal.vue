<template>
  <Transition
      enter-active-class="transition-all duration-700 ease-out"
      enter-from-class="opacity-0 scale-105"
      leave-active-class="transition-all duration-500 ease-in"
      leave-to-class="opacity-0 scale-95"
  >
    <!-- Модалка видна, пока в сторе нет токена -->
    <div v-if="!userStore.token" class="fixed inset-0 z-[300] flex items-center justify-center p-6 backdrop-blur-3xl bg-black/90 font-sans text-white">
      <div class="w-full max-w-md p-10 md:p-14 rounded-[56px] bg-zinc-900 border border-white/5 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col gap-8 relative overflow-hidden">

        <!-- Декоративное свечение -->
        <div class="absolute -top-24 -left-24 w-48 h-48 bg-[var(--ui-accent)]/10 blur-[80px]"></div>

        <!-- Заголовок -->
        <div class="flex flex-col gap-2 text-center relative z-10">
          <h2 class="text-4xl font-black uppercase italic tracking-tighter leading-none transition-all duration-500">
            {{ isLogin ? 'System Login' : 'Registry' }}
          </h2>
          <p class="text-[10px] font-mono text-white/20 uppercase tracking-[0.5em] italic">
            {{ isLogin ? 'Access_Protocol_v4.0' : 'Identity_Initialization' }}
          </p>
        </div>

        <!-- Переключатель режима -->
        <div class="flex p-1 bg-white/5 rounded-2xl border border-white/5 relative z-10">
          <button
              @click="isLogin = true; error = ''; successMessage = ''"
              class="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer"
              :class="isLogin ? 'bg-[var(--ui-accent)] text-black shadow-lg' : 'text-white/40 hover:text-white'"
          >Вход</button>
          <button
              @click="isLogin = false; error = ''; successMessage = ''"
              class="flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-none cursor-pointer"
              :class="!isLogin ? 'bg-[var(--ui-accent)] text-black shadow-lg' : 'text-white/40 hover:text-white'"
          >Регистрация</button>
        </div>

        <!-- Поля ввода -->
        <div class="flex flex-col gap-4 relative z-10">
          <!-- Username -->
          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] font-black uppercase text-[var(--ui-accent)] ml-6 italic opacity-50">Username</span>
            <input
                v-model="form.username"
                type="text"
                class="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-sm font-bold outline-none focus:border-[var(--ui-accent)]/40 transition-all italic text-white"
                placeholder="Min. 3 characters..."
            />
          </div>

          <!-- Email (Только при регистрации) -->
          <Transition enter-active-class="transition-all duration-300" enter-from-class="opacity-0 -translate-y-2">
            <div v-if="!isLogin" class="flex flex-col gap-1.5">
              <span class="text-[9px] font-black uppercase text-[var(--ui-accent)] ml-6 italic opacity-50">Email Address</span>
              <input
                  v-model="form.email"
                  type="email"
                  class="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-sm font-bold outline-none focus:border-[var(--ui-accent)]/40 transition-all italic text-white"
                  placeholder="Real email required..."
              />
            </div>
          </Transition>

          <!-- Access Key -->
          <div class="flex flex-col gap-1.5">
            <span class="text-[9px] font-black uppercase text-[var(--ui-accent)] ml-6 italic opacity-50">Access Key</span>
            <input
                v-model="form.password"
                type="password"
                class="w-full bg-white/5 border border-white/10 rounded-3xl px-8 py-5 text-sm font-bold outline-none focus:border-[var(--ui-accent)]/40 transition-all italic text-white"
                placeholder="Min. 6 characters..."
            />
          </div>
        </div>

        <!-- Кнопка действия -->
        <div class="flex flex-col gap-4 relative z-10">
          <button
              @click="handleSubmit"
              :disabled="userStore.isAuthLoading"
              class="w-full py-6 rounded-[24px] bg-[var(--ui-accent)] text-black font-black uppercase tracking-widest italic border-none cursor-pointer shadow-xl shadow-[var(--ui-accent)]/10 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
          >
            {{ userStore.isAuthLoading ? 'Connecting...' : (isLogin ? 'Initialize' : 'Create Registry') }}
          </button>
        </div>

        <!-- Статус-сообщения -->
        <div class="min-h-[20px] flex items-center justify-center">
          <Transition enter-active-class="animate-shake" leave-active-class="opacity-0">
            <div v-if="error" class="text-center text-red-500 text-[10px] font-black uppercase tracking-widest italic">
              {{ error }}
            </div>
          </Transition>

          <Transition enter-active-class="transition-all duration-500" enter-from-class="opacity-0 translate-y-2">
            <div v-if="successMessage" class="text-center text-green-400 text-[10px] font-black uppercase tracking-widest italic animate-pulse">
              {{ successMessage }}
            </div>
          </Transition>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUserStore } from '@/entities/user/model/userStore'
import { ref } from 'vue'

const userStore = useUserStore()
const isLogin = ref(true)
const error = ref('')
const successMessage = ref('')

const form = ref({
  username: '',
  password: '',
  email: ''
})

const validate = () => {
  if (form.value.username.length < 3) {
    error.value = 'Username too short'
    return false
  }
  if (form.value.password.length < 6) {
    error.value = 'Access Key: min 6 characters'
    return false
  }
  if (!isLogin.value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.value.email)) {
      error.value = 'Invalid email format'
      return false
    }
  }
  return true
}

const handleSubmit = async () => {
  error.value = ''
  successMessage.value = ''

  if (!validate()) return

  if (isLogin.value) {
    // ВХОД
    const res = await userStore.login({
      username: form.value.username,
      password: form.value.password
    })
    if (!res.success) {
      error.value = res.message
    }
  } else {
    // РЕГИСТРАЦИЯ
    const res = await userStore.register(form.value)
    if (res.success) {
      // Показываем сообщение об успехе
      successMessage.value = 'Success! Check your email to verify account.'

      // Очищаем форму пароля для безопасности
      form.value.password = ''

      // Через 4 секунды переключаем на вход автоматически
      setTimeout(() => {
        isLogin.value = true
        successMessage.value = ''
      }, 5000)
    } else {
      error.value = res.message
    }
  }
}
</script>

<style scoped>
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

input::placeholder {
  color: rgba(255, 255, 255, 0.2);
  font-style: italic;
}
</style>