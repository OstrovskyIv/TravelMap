import './styles/main.css' // Стили теперь в подпапке styles

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './providers/router' // Путь к роутеру внутри app

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')