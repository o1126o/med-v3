import router from '@/router'
import { useUserStore } from '@/stores'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({
  showSpinner: false
})

// 不需要登录的⻚⾯，⽩名单
const wihteList = ['/login', '/register', '/404', '/401']

router.beforeEach((to, from) => {
  // 开启进度条
  NProgress.start()
  // ⽤户仓库
  const store = useUserStore()
  // 如果没有token，并且进入的也不是白名单中页面，直接去登录页
  document.title = '医疗问诊 - ' + to.meta.title
  NProgress.done()
  if (!store.user?.token && !wihteList.includes(to.path)) return '/login'
})
