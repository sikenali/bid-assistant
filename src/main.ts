import { createApp } from 'vue'
import './assets/styles/variables.css'
import App from './App.vue'
import router from './router'
import icons from './plugins/icons'

// 创建Vue应用实例
const app = createApp(App)

// 使用路由
app.use(router)

// 使用图标插件
app.use(icons)

// 挂载应用
app.mount('#app')
