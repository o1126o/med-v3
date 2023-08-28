<script setup lang="ts">
import CpNavBar from '@/components/CpNavBar.vue'
import { loginByPassword, sendMobileCode, loginByMobile } from '@/servces/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { ref, onUnmounted } from 'vue'
import CpIcon from '@/components/CpIcon.vue'
import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import { showToast } from 'vant'

const router = useRouter()
const route = useRoute()
const store = useUserStore()

// 切换数据
const isPass = ref<boolean>(true)

// 表单数据
const loginFrom = ref({
  mobile: '13230000001',
  password: 'abc12345',
  code: ''
})
// 是否同意协议
const agree = ref<boolean>(false)
// 控制密码显示与隐藏
const show = ref<boolean>(false)

// 登录
const handleLogin = async () => {
  console.log('123456')
  if (!agree.value) return showToast('请勾选我已同意')
  // 通过验证
  try {
    const loginRes = isPass.value
      ? await loginByPassword(loginFrom.value.mobile, loginFrom.value.password)
      : await loginByMobile(loginFrom.value.mobile, loginFrom.value.code)
    console.log(loginRes)
    store.setUser(loginRes.data.data)
    // 如果有回调地址的话就回跳 否则跳到个人中心
    router.push((route.query.returnUrl as string) || '/user')
    showToast('登录成功')
  } catch (error) {
    console.log(error)
  }
}

// 发送验证码
const time = ref(0) // 倒计时
let timeId: number = 0
const send = async () => {
  // 倒计时time的值⼤于0，此时不能发送验证码
  if (time.value > 0) return
  // 调用接口
  const codeRef = await sendMobileCode(loginFrom.value.mobile, 'login')
  console.log('codeRef=>', codeRef.data.data.code)
  // 倒计时逻辑
  showToast('发送成功')
  time.value = 60
  // 倒计时
  clearInterval(timeId)
  timeId = setInterval(() => {
    time.value--
    if (time.value <= 0) window.clearInterval(timeId)
  }, 1000)
}
onUnmounted(() => {
  clearInterval(timeId)
})
</script>
<template>
  <div class="login-page">
    <!-- 导航 -->
    <CpNavBar sidTitle="注册" title="登录" @click-right="router.push('/register')"></CpNavBar>
    <div class="login-head">
      <!-- 标题切换 -->
      <h3>{{ isPass ? '密码登陆' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? '短信验证码登录' : '密码登陆' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- form表单 -->
    <van-form autocomplete="off" @submit="handleLogin">
      <van-field
        v-model="loginFrom.mobile"
        placeholder="请输入手机号"
        type="tel"
        :rules="mobileRules"
      ></van-field>
      <!-- 密码 -->
      <van-field
        v-if="isPass"
        v-model="loginFrom.password"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
        :rules="passwordRules"
      >
        <template #button>
          <cp-icon @click="show = !show" :name="`login-eye-${show ? 'on' : 'off'}`"></cp-icon>
        </template>
      </van-field>
      <!-- 短信验证码 -->
      <van-field v-else placeholder="短信验证码" :rules="codeRules" v-model="loginFrom.code">
        <template #button>
          <span class="btn-send" @click="send" :class="{ active: time > 0 }">
            {{ time > 0 ? time + 's后再次发送' : '发送验证码' }}
          </span>
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

    .van-button {
      background-color: var(--cp-primary);
      border: 0;
    }
  }
}

.send-btn {
  color: var(--cp-primary);
}

.active {
  color: rgba(22, 194, 163, 0.5);
}
</style>
