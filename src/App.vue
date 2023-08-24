<script setup lang="ts">
import { Button as VanButton } from 'vant'
import { useUserStore } from './stores'
const store = useUserStore()

const handleLogin = () => {
  store.setUser({ token: 'tokens', id: '1', mobile: '12332123432', account: 'aa', avatar: 'xp' })
}
</script>

<template>
  <p>{{ store.user }}</p>
  <van-button type="success" @click="handleLogin">登录</van-button>
  <van-button type="danger" @click="store.delUser()">退出登录</van-button>
</template>

<style scoped>
p {
  width: 300px;
  height: 200px;
  background-color: pink;
}
</style>
