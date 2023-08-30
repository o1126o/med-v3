<script setup lang="ts">
import DoctorCard from './DoctorCard.vue'
import { getDoctorPage } from '@/servces/home'
import type { DoctorList } from '@/types/consult'
import { onMounted, ref } from 'vue'

const doctorList = ref<DoctorList>()
const loadData = async () => {
  const res = await getDoctorPage({ current: 1, pageSize: 5 })
  doctorList.value = res.data.rows
}
onMounted(() => loadData())
</script>

<template>
  <div class="follow-page">
    <div class="follow-page-head">
      <p>推荐关注</p>
      <a href="javascript:;"> 查看更多<i class="van-icon van-icon-arrow" /></a>
    </div>
    <div class="follow-page-body">
      <van-swipe :width="150" :show-indicators="false" :loop="false">
        <van-swipe-item v-for="item in doctorList" :key="item.id">
          <DoctorCard :item="item"></DoctorCard>
        </van-swipe-item>
      </van-swipe>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.follow-page {
  background-color: var(--cp-bg);
  box-sizing: border-box;
  font-size: 13px;
  height: 250px;

  &-head {
    display: flex;
    justify-content: space-between;
    padding: 14px 15px;

    a {
      color: var(--cp-tip);
    }
  }

  &-body {
    width: 100%;
    overflow: hidden;
  }
}
</style>
