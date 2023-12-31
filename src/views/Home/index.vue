<script setup lang="ts">
import KnowledgeList from './components/KnowledgeList.vue'
import FollowDoctor from './components/FollowDoctor.vue'
import type { KnowledgeType } from '@/types/consult'
const active = ref<KnowledgeType>('recommend')
import { ref } from 'vue'
import { useConsultStore } from '@/stores'
import { ConsultType } from '@/enums'
const store = useConsultStore()
</script>

<template>
  <div class="home-page">
    <!-- 头部 -->
    <div class="home-page-header">
      <div class="con">
        <h1>优医</h1>
        <div class="search">
          <cp-icon name="home-search"></cp-icon> 搜一搜：疾病/症状/医生/健康知识
        </div>
      </div>
    </div>
    <!-- 导航 -->
    <div class="home-page-navs">
      <van-row>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-doctor"></cp-icon>
            <p class="title">问医⽣</p>
            <p class="desc">按科室查问医⽣</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/consult/fast" class="nav" @click="store.setType(ConsultType.Fast)">
            <cp-icon name="home-graphic"></cp-icon>
            <p class="title">极速问诊</p>
            <p class="desc">20s医⽣极速回复</p>
          </router-link>
        </van-col>
        <van-col span="8">
          <router-link to="/" class="nav">
            <cp-icon name="home-prescribe"></cp-icon>
            <p class="title">开药⻔诊</p>
            <p class="desc">线上买药更⽅便</p>
          </router-link>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-order"></cp-icon>
            <p class="title">药品订单</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-docs"></cp-icon>
            <p class="title">健康档案</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-rp"></cp-icon>
            <p class="title">我的处⽅</p>
          </router-link>
        </van-col>
        <van-col span="6">
          <router-link to="/" class="nav min">
            <cp-icon name="home-find"></cp-icon>
            <p class="title">疾病查询</p>
          </router-link>
        </van-col>
      </van-row>
    </div>
    <!-- 轮播图 -->
    <div class="home-page-banner">
      <van-swipe indicator-color="#fff">
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
        <van-swipe-item>
          <img src="@/assets/ad.png" alt="" />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 标签 -->
    <van-tabs v-model:active="active" shrink>
      <van-tab title="关注" name="like">
        <FollowDoctor></FollowDoctor>
        <KnowledgeList type="like"></KnowledgeList>
      </van-tab>
      <van-tab title="推荐" name="recommend">
        <KnowledgeList type="recommend"></KnowledgeList>
      </van-tab>
      <van-tab title="减脂" name="fatReduction">
        <KnowledgeList type="fatReduction"></KnowledgeList>
      </van-tab>
      <van-tab title="饮食" name="food">
        <KnowledgeList type="food"></KnowledgeList>
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  padding-bottom: 50px;

  &-header {
    height: 100px;
    height: 100px;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 90px;
      background: linear-gradient(180deg, rgba(62, 206, 197, 0.85), #26bcc6);
      border-bottom-left-radius: 150px 20px;
      border-bottom-right-radius: 150px 20px;
    }

    .con {
      position: relative;
      padding: 0 15px;

      h1 {
        font-size: 18px;
        color: #fff;
        font-weight: normal;
        padding: 20px 0;
        line-height: 1;
        padding-left: 5px;
      }

      .search {
        height: 40px;
        border-radius: 20px;
        box-shadow: 0px 15px 22px -7px rgba(224, 236, 250, 0.8);
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0 20px;
        color: var(--cp-dark);
        font-size: 13px;

        .cp-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
  }

  &-navs {
    padding: 10px 15px 0 15px;

    .nav {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 10px 0;

      .cp-icon {
        font-size: 48px;
      }

      .title {
        margin-top: 5px;
        color: var(--cp-text1);
      }

      .desc {
        font-size: 10px;
        color: var(--cp-tag);
        margin-top: 2px;
      }
    }

    .min {
      .cp-icon {
        font-size: 31px;
      }

      .title {
        margin-top: 5px;
        color: var(--cp-text1);
        font-size: 13px;
      }
    }
  }

  &-banner {
    padding: 10px 15px;
    height: 100px;

    img {
      width: 100%;
      height: 100%;
    }
  }

  // 全局覆盖van-tab样式
  ::v-deep() {
    .van-tabs {
      .van-tabs__nav {
        padding: 0 0 15px 0;
      }

      .van-tab--active {
        font-weight: normal;
      }

      .van-tabs__line {
        width: 20px;
        background-color: var(--cp-primary);
      }

      .van-tab {
        padding: 0 15px;
      }
    }
  }
}
</style>
