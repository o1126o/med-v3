<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
defineProps<{
  title?: string
  sidTitle?: string
}>()
const onClickLeft = () => {
  // 判断历史记录中是否有回退
  if (history.state?.back) {
    router.back()
  } else {
    router.push('/')
  }
}
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const onClickRight = () => {
  emit('click-right')
}
</script>

<template>
  <div class="nav-page">
    <van-nav-bar
      left-arrow
      @click-left="onClickLeft"
      fixed
      :title="title"
      :right-text="sidTitle"
      @click-right="onClickRight"
    ></van-nav-bar>
  </div>
</template>

<style lang="scss" scoped>
::v-deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
      color: val(--cp-primary);
    }
  }
}
</style>
