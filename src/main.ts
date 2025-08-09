<<<<<<< HEAD
=======
import * as lucide from 'lucide-vue-next'

>>>>>>> 5bd82e21f5e14d7bdf969c6ae24776793f0c645b
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import router from './router'
import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

Object.entries(lucide).forEach(([name, component]) => {
  app.component(name, component)
})
app.mount('#app')
