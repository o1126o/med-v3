import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'my-user',
  () => {
    // 用户信息
    const user = ref<User>()
    // 设置用户
    const setUser = (u: User) => {
      user.value = u
      // localStorage.setItem('user', user.value)
    }
    // 清空用户
    const delUser = () => {
      user.value = undefined
    }
    return { user, setUser, delUser }
  },
  {
    persist: true
  }
)
