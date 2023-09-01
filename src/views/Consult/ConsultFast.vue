<script setup lang="ts"></script>

<template>
  <div class="fast-page">
    <CpNavBar title="极速问诊" sidTitle="问诊记录"></CpNavBar>
    <div class="fast-page-logo">
      <img src="@/assets/consult-fast.png" alt="" />
      <p class="text"><span>20s</span> 快速匹配专业医生</p>
    </div>
    <div class="fast-page-type">
      <router-link to="/consult/dep" class="item">
        <cp-icon name="consult-doctor"></cp-icon>
        <div class="info">
          <p>三甲图文问诊</p>
          <p>三甲主治及以上级别医生</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </router-link>
      <router-link to="/consult/dep" class="item">
        <cp-icon name="consult-message"></cp-icon>
        <div class="info">
          <p>普通图文问诊</p>
          <p>二甲主治及以上级别医生</p>
        </div>
        <van-icon name="arrow"></van-icon>
      </router-link>
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

  &-type {
    box-sizing: border-box;
    padding: 0 15px;

    .item {
      border: 1px solid var(--cp-line);
      display: flex;
      align-items: center;
      padding: 18px;
      margin-top: 15px;
      border-radius: 5px;

      .cp-icon {
        font-size: 40px;
      }

      .info {
        margin-left: 15px;
        flex: 1;

        > p:first-child {
          font-size: 16px;
          color: var(--cp-text1);
          margin-bottom: 4px;
        }

        > p:last-child {
          font-size: 13px;
          color: var(--cp-tag);
        }
      }

      .van-icon {
        color: var(--cp-tip);
      }
    }
  }
}
</style>
