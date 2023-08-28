import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import './styles/main.scss'
import 'virtual:svg-icons-register'

// 引入vant
import 'vant/lib/index.css'

const app = createApp(App)

app.use(pinia)

app.use(router)

// 引入权限文件
import './permission'

app.mount('#app')
