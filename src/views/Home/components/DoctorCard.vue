<script setup lang="ts">
import type { Doctor } from '@/types/consult'
import { useFollow } from '@/composable'
defineProps<{ item: Doctor }>()
const { loading, follow } = useFollow()
</script>

<template>
  <div class="doctor-page">
    <van-image round :src="item.avatar" />
    <p class="name">{{ item.name }}</p>
    <p class="van-ellipsis">{{ item.hospitalName }} {{ item.depName }}</p>
    <p>{{ item.positionalTitles }}</p>
    <van-button :loading="loading" round size="small" type="primary" @click="follow(item)">
      {{ item.likeFlag === 1 ? '已关注' : '+ 关注' }}
    </van-button>
  </div>
</template>

<style lang="scss" scoped>
.doctor-page {
  width: 135px;
  height: 190px;
  padding: 15px;
  border-radius: 20px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 0px 11px 0px rgba(229, 229, 229, 0.2);
  box-sizing: border-box;
  text-align: center;
  margin-left: 15px;
  display: inline-block;

  .van-image {
    width: 58px;
    height: 58px;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 auto 8px;
  }

  p {
    margin-bottom: 0;
    font-size: 11px;
    color: var(--cp-tip);

    &.name {
      font-size: 13px;
      color: var(--cp-text1);
      margin-bottom: 5px;
    }
  }

  .van-button {
    padding: 0 12px;
    height: 28px;
    margin-top: 8px;
    width: 72px;
    background-color: var(--cp-primary);
  }
}
</style>
