<script setup lang="ts">
import CpNavBar from '@/components/CpNavBar.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <div class="login-page">
    <!-- 导航 -->
    <CpNavBar title="登录" @click-right="router.push('/login')"></CpNavBar>
  </div>
</template>
<style lang="scss" scoped></style>
