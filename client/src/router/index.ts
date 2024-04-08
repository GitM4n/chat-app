import { createRouter, createWebHistory } from 'vue-router'

import SettingsView from '@/views/SettingsView.vue'
import ChatMenu from '@/views/ChatMenu.vue'

const router = createRouter({
  history: createWebHistory(),//import.meta.env.BASE_URL
  routes: [
    {
      path: '/',
      name: 'chat',
      component: ChatMenu
    },
    {
      path: '/settings',
      name: 'settings',
      component:() => SettingsView
    },
   
  ]
})

export default router
