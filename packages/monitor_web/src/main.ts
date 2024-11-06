import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { i18n } from '@/i18n'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persistedstate'
import { install } from '@/plugins/ecahrts'
import 'normalize.css'
import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)
const store = createPinia()
store.use(piniaPluginPersist)
// app.config.globalProperties.$ELEMENT = { size: 'default' }

install(app)
app.use(router).use(store).use(i18n).mount('#app')
