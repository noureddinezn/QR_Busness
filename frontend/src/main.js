import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App).use(createPinia()).use(router)
router.isReady().then(() => {
  app.mount('#app')
  clearTimeout(window.profileBootTimeout)
}).catch(() => {
  document.getElementById('boot-message').textContent = 'Unable to load the app. Please try again.'
  document.getElementById('boot-retry').style.display = 'block'
})
