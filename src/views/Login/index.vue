<script setup lang="ts">
import CpNavBar from '@/components/CpNavBar.vue'
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import CpIcon from '@/components/CpIcon.vue'
import { mobileRules, passwordRules } from '@/utils/rules'
import { showToast } from 'vant'

const router = useRouter()

// 表单数据
const loginFrom = ref({
  mobile: '13230000001',
  password: 'abc12345'
})
// 是否同意协议
const agree = ref(false)
// 控制密码显示与隐藏
const show = ref(false)

// 登录
const login = () => {
  if (!agree.value) return showToast('请勾选我已同意')
}
</script>
<template>
  <div class="login-page">
    <!-- 导航 -->
    <CpNavBar title="注册" @click-right="router.push('/register')"></CpNavBar>
    <div class="login-head">
      <h3>密码登陆</h3>
      <a href="javascript:;">
        <span>短信验证码登录</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form表单 -->
    <van-form autocomplete="off" @submit="login">
      <van-field
        v-model="loginFrom.mobile"
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileRules"
      ></van-field>
      <van-field
        v-model="loginFrom.password"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">登录</van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码</a>
      </div>
    </van-form>
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }

  &-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    padding: 30px 30px 50px;

    h3 {
      font-size: 24px;
      font-weight: normal;
    }

    a {
      font-size: 15px;
    }
  }

  &-other {
    margin-top: 60px;
    padding: 0 30px;

    .icon {
      display: flex;
      justify-content: center;

      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}

.van-form {
  padding: 0 14px;

  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    display: flex;
    box-sizing: border-box;
    align-items: center;

    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
}
</style>
