import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import './assets/css/ims.css'
import {httpClient} from './assets/js/ims.js'

const app = createApp(App)
app.config.globalProperties.$http = httpClient
app.use(router)
app.use(ElementPlus)
app.mount('#app')
