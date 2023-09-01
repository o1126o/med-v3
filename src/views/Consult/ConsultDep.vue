<script setup lang="ts">
import type { TopDep } from '@/types/consult'
import { onMounted, ref, computed } from 'vue'
import { getAllDep } from '@/servces/consult'

import { useConsultStore } from '@/stores'
const store = useConsultStore()

const active = ref(0)

// ⼀级科室
const allDep = ref<TopDep[]>([])
onMounted(async () => {
  const res = await getAllDep()
  allDep.value = res.data
})
// ⼆级科室，注意：组件初始化没有数据 child 可能拿不到
const subDep = computed(() => allDep.value[active.value]?.child)
</script>

<template>
  <div class="dep-page">
    <CpNavBar title="选择科室"></CpNavBar>
    <div class="dep-page-wrapper">
      <van-sidebar v-model="active">
        <van-sidebar-item :title="top.name" v-for="top in allDep" :key="top.id" />
      </van-sidebar>
      <div class="sub">
        <router-link
          to="/consult/illness"
          v-for="sub in subDep"
          :key="sub.id"
          @click="store.setDep(sub.id)"
        >
          {{ sub.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dep-page {
  padding-top: 46px;
  box-sizing: border-box;

  &-wrapper {
    display: flex;

    .van-sidebar {
      width: 114px;

      &-item {
        padding: 14px;
        color: var(--cp-tag);

        &--select {
          color: var(--cp-primary);
          font-weight: normal;

          &::before {
            display: none;
          }
        }
      }
    }

    .sub {
      flex: 1;
      height: 100%;
      overflow-y: auto;

      > a {
        display: block;
        padding: 14px 30px;
      }
    }
  }
}
</style>
