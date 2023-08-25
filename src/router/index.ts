// createRouter 创建路由实例，===> new VueRouter()
// history 是路由模式，hash模式，history模式
// createWebHistory() 是开启history模块
// createWebHashHistory() 是开启hash模式
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  //  import.meta.env.BASE_URL 是路由的基准地址，默认是 '/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/index.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register/index.vue')
    }
  ]
})

export default router
