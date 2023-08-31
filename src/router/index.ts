// createRouter 创建路由实例，===> new VueRouter()
// history 是路由模式，hash模式，history模式
// createWebHistory() 是开启history模块
// createWebHashHistory() 是开启hash模式
import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/Layout/index.vue'

const router = createRouter({
  //  import.meta.env.BASE_URL 是路由的基准地址，默认是 '/'
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Layout,
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/Home/index.vue'),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('@/views/Article/index.vue'),
          meta: {
            title: '健康百科'
          }
        },
        {
          path: '/notify',
          name: 'notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: {
            title: '消息通知'
          }
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/User/index.vue'),
          meta: {
            title: '个人中心'
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login/index.vue'),
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register/index.vue'),
      meta: {
        title: '注册'
      }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    }
  ]
})

export default router
