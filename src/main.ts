import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { initConsoleEasterEgg } from './utils/console'

const app = createApp(App)
app.use(router)
app.mount('#app')

// 初始化控制台彩蛋
initConsoleEasterEgg() 