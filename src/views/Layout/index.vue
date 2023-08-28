<script setup lang="ts">
const tabBarList = [
  {
    name: '首页',
    default: 'home-index-default',
    active: 'home-index-active',
    path: '/home'
  },
  {
    name: '健康百科',
    default: 'home-article-default',
    active: 'home-article-active',
    path: '/article'
  },
  {
    name: '消息中心',
    default: 'home-notice-default',
    active: 'home-notice-active',
    path: '/notify'
  },
  {
    name: '我的',
    default: 'home-mine-default',
    active: 'home-mine-active',
    path: '/user'
  }
]
</script>

<template>
  <div class="loyout-page">
    <van-tabbar route active-color="#42c2a3" inactive-color="#727374">
      <van-tabbar-item v-for="(item, index) in tabBarList" :key="index" :to="item.path">
        {{ item.name }}
        <template #icon="{ active }">
          <cp-icon :name="active ? item.active : item.default" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
    <router-view></router-view>
    loyout
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  ::v-deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }

      &__text {
        font-size: 11px;
      }
    }
  }
}
</style>
