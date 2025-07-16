import { createRouter, createWebHashHistory } from 'vue-router'
import Setting from '@/views/setting/index.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'setting',
      component: Setting
    },
  ]
})

export default router
