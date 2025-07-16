import './assets/main.css'

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
// @ts-ignore
// import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import './global.d.ts'

const app = createApp(App)

app.use(router)
// app.use(ElementPlus, {
//   locale: zhCn,
// })

app.mount('#app')
