<script setup lang="ts"></script>

<template>
  <div class="fast-page">
    <CpNavBar title="极速问诊" sidTitle="问诊记录"></CpNavBar>
    <div class="fast-page-logo">
      <img src="@/assets/consult-fast.png" alt="" />
      <p class="text"><span>20s</span> 快速匹配专业医生</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fast-page {
  box-sizing: border-box;
  padding-top: 46px;

  &-logo {
    padding: 30px 0;
    display: flex;
    flex-direction: column;
    align-items: center;

    img {
      width: 240px;
    }

    .text {
      font-size: 16px;
      margin-top: 16px;

      span {
        color: var(--cp-primary);
      }
    }
  }
}
</style>
