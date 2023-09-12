<script setup lang="ts">
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePage } from '@/servces/home'
import { ref } from 'vue'
import type { KnowledgeList, KnowledgeParams, KnowledgeType } from '@/types/consult'
const props = defineProps<{
  type: KnowledgeType
}>()

const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})

// 滚动到页面底部
const onLoad = async () => {
  // 加载更多
  const res = await getKnowledgePage(params.value)
  list.value.push(...res.data.rows)
  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  } else {
    params.value.current++
  }
  loading.value = false
}
</script>

<template>
  <div class="list-page">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <KnowledgeCard v-for="item in list" :key="item.id" :item="item"></KnowledgeCard>
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.list-page {
  padding: 0 15px;
}
</style>
