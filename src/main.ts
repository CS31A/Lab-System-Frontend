import { createPinia } from 'pinia'

import { createApp } from 'vue'
import Toast from 'vue-toastification'
import App from './App.vue'
import router from './router'

import 'vue-toastification/dist/index.css'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Toast)
app.mount('#app')
