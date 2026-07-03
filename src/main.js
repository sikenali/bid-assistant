import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './views/Home.vue'
import Collection from './views/Collection.vue'
import './assets/styles/main.css'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/collection', name: 'collection', component: Collection },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount('#app')
