import './styles/main.css'
import { createApp } from 'vue'
import { store } from './providers/store'
import router from './providers/router'
import App from './App.vue'

const app = createApp(App)

app.use(store)
app.use(router)

app.mount('#app')

const urlParams = new URLSearchParams(window.location.search);
const redirectPath = urlParams.get('p');
if (redirectPath) {
    window.history.replaceState(null, '', import.meta.env.BASE_URL + redirectPath.slice(1));
}