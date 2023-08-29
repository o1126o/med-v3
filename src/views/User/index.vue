<script setup lang="ts">
import { useUserStore } from '@/stores/index'
import { useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
import { showToast } from 'vant'
import { getUserInfo } from '@/servces/user'
const store = useUserStore()
const router = useRouter()
import { ref } from 'vue'
import type { UserInfo } from '@/types/user.d.ts'

// 初始化一个变量, 用来保存用户信息
const user = ref<UserInfo>()
// 获取用户信息
const initUserInfo = async () => {
  const userRes = await getUserInfo()
  user.value = userRes.data
  console.log('user.value ', user.value)
}
initUserInfo()

const tools = [
  {
    title: '我的问诊',
    path: ''
  },
  {
    title: '我的处方',
    path: ''
  },
  {
    title: '家庭档案',
    path: '/user/patient'
  },
  {
    title: '地址管理',
    path: ''
  },
  {
    title: '我的评价',
    path: ''
  },
  {
    title: '设置',
    path: ''
  }
]

// 退出登录
const handleLoyout = async () => {
  await showConfirmDialog({
    title: '温馨提示',
    message: '您确认要退出优医问诊吗？',
    cancelButtonText: '取消',
    confirmButtonText: '确认'
  })
    .then(() => {
      // on confirm
      store.delUser()
      router.push('/login')
      showToast('退出登录成功')
    })
    .catch(() => {
      // on cancel
      showToast('取消退出登录')
    })
}
</script>

<template>
  <div class="user-page" v-if="user">
    <div class="user-page-head">
      <div class="top">
        <van-image round fit="cover" :src="user.avatar" />
        <div class="name">
          <p>{{ user.account }}</p>
          <p><van-icon name="edit" /></p>
        </div>
      </div>
      <van-row>
        <van-col span="6">
          <p>{{ user.collectionNumber }}</p>
          <p>收藏</p>
        </van-col>
        <van-col span="6">
          <p>{{ user.likeNumber }}</p>
          <p>关注</p>
        </van-col>
        <van-col span="6">
          <p>{{ user.score }}</p>
          <p>积分</p>
        </van-col>
        <van-col span="6">
          <p>{{ user.couponNumber }}</p>
          <p>优惠券</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-order">
      <div class="head">
        <h3>药品订单</h3>
        <router-link to="/order">全部订单 <van-icon name="arrow" /></router-link>
      </div>
      <van-row>
        <van-col span="6">
          <cp-icon name="user-paid" />
          <p>待付款</p>
        </van-col>
        <van-col span="6">
          <cp-icon name="user-shipped" />
          <p>待发货</p>
        </van-col>
        <van-col span="6">
          <cp-icon name="user-received" />
          <p>待收货</p>
        </van-col>
        <van-col span="6">
          <cp-icon name="user-finished" />
          <p>已完成</p>
        </van-col>
      </van-row>
    </div>
    <div class="user-page-group">
      <h3>快捷工具</h3>
      <van-cell
        v-for="(item, index) in tools"
        :key="index"
        :title="item.title"
        is-link
        :border="false"
        :to="item.path"
      >
        <template #icon><cp-icon :name="`user-tool-0${index + 1}`" /></template>
      </van-cell>
    </div>
    <p class="user-page-loyout" @click="handleLoyout">退出登录</p>
  </div>
</template>

<style lang="scss" scoped>
.user-page {
  background-color: var(--cp-bg);
  min-height: calc(100vh - 50px);
  padding: 0 15px 65px;

  // 头部
  &-head {
    height: 200px;
    margin: 0 -15px;
    padding: 0 15px;
    background: linear-gradient(180deg, rgba(44, 181, 165, 0.46), rgba(44, 181, 165, 0));

    .top {
      display: flex;
      align-items: center;
      padding-top: 50px;

      .van-image {
        width: 70px;
        height: 70px;
      }

      .name {
        padding-left: 10px;

        p {
          &:first-child {
            font-size: 18px;
            font-weight: 500;
          }

          &:last-child {
            font-size: 16px;
            color: var(--cp-primary);
            margin-top: 10px;
          }
        }
      }
    }

    .van-row {
      margin: 0 -15px;
      padding-top: 15px;

      p {
        text-align: center;

        &:first-child {
          font-size: 18px;
          font-weight: 500;
        }

        &:last-child {
          color: var(--cp-dark);
          font-size: 12px;
          padding-top: 4px;
        }
      }
    }
  }

  // 订单
  &-order {
    background-color: #fff;
    border-radius: 8px;
    margin-bottom: 15px;
    padding-bottom: 15px;

    .head {
      display: flex;
      justify-content: space-between;
      line-height: 50px;
      padding: 0 15px;

      a {
        color: var(--cp-tip);
      }
    }

    .van-col {
      text-align: center;

      .cp-icon {
        font-size: 28px;
      }

      P {
        font-size: 12px;
        padding-top: 4px;
      }
    }
  }

  // 快捷工具
  &-group {
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;

    h3 {
      padding-left: 16px;
      line-height: 44px;
    }

    .van-cell {
      align-items: center;
      height: 52px;
    }

    .cp-icon {
      font-size: 17px;
      margin-right: 10px;
    }
  }

  // 退出登录
  &-loyout {
    text-align: center;
    margin: 15px;
    color: var(--cp-price);
  }
}
</style>
