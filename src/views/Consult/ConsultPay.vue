<script setup lang="ts">
import { getConsultOrderPre, createConsultOrder } from '@/servces/consult'
import { getPatientDetail } from '@/servces/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData } from '@/types/consult'
import type { Patient } from '@/types/user'
import { onMounted, ref } from 'vue'
import { showToast } from 'vant'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { showConfirmDialog } from 'vant'
const store = useConsultStore()
const router = useRouter()
const payInfo = ref<ConsultOrderPreData>()
// 获取预⽀付订单信息
const priceAll = ref(0)
const loadData = async () => {
  const res = await getConsultOrderPre({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  // 解决一直报payInfo.actualPayment *100未定义问题
  if (payInfo.value !== undefined) {
    priceAll.value = Number(payInfo.value.actualPayment) * 100
  }
  console.log(payInfo.value)
  // 设置默认优惠券
  store.setCoupon(payInfo.value?.couponId)
}
const patient = ref<Patient>()
// 患者信息
const loadPatient = async () => {
  if (!store.consult.patientId) return
  const res = await getPatientDetail(store.consult.patientId)
  patient.value = res.data
}

// 是否同意协议
const agree = ref(false)
const show = ref(false)
const loading = ref(false) // 支付加载
const orderId = ref('') // 订单id
const paymentMethod = ref<0 | 1>() // 支付方式
// 确定支付，跳转
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意⽀付协议')
  loading.value = true
  const res = await createConsultOrder(store.consult)
  orderId.value = res.data.id
  loading.value = false
  store.clear()
  // 打开
  show.value = true
}

// 生成订单后不可回退
onBeforeRouteLeave(() => {
  if (orderId.value) return false
})
const onClose = () => {
  return showConfirmDialog({
    title: '关闭⽀付',
    message: '取消⽀付将⽆法获得医⽣回复，医⽣接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续⽀付',
    confirmButtonColor: 'var(--cp-primary)'
  })
    .then(() => {
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}

// 问诊⽀付-流程讲解{#pay-line}
onMounted(() => {
  if (
    !store.consult.type ||
    !store.consult.illnessDesc ||
    !store.consult.illnessTime ||
    !store.consult.patientId ||
    !store.consult.depId
  ) {
    return showConfirmDialog({
      title: '温馨提示',
      message: '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }

  loadData()
  loadPatient()
})
</script>

<template>
  <div class="pay-page">
    <CpNavBar title="支付"></CpNavBar>
    <div class="pay-page-info">
      <p class="tit">图⽂问诊 {{ payInfo?.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>⾃动分配医⽣</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo?.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo?.pointDeduction}`" />
      <van-cell title="实付款" :value="`¥${payInfo?.actualPayment}`" class="pay-price" />
    </van-cell-group>
    <div class="pay-page-space"></div>
    <van-cell-group>
      <van-cell
        itle="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-page-schema">
      <van-checkbox v-model="agree">我已同意 <span class="text">⽀付协议</span></van-checkbox>
    </div>
    <van-submit-bar
      button-type="primary"
      :price="priceAll"
      button-text="⽴即⽀付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
    <!-- 支付组件 -->
    <cp-pay-sheet
      v-model:show="show"
      :order-id="orderId"
      :actualPayment="payInfo?.actualPayment"
      :onClose="onClose"
    />
  </div>
</template>

<style lang="scss" scoped>
.pay-page {
  padding: 46px 0 50px 0;

  &-info {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 15px;

    .tit {
      width: 100%;
      font-size: 16px;
      margin-bottom: 10px;
    }

    .img {
      margin-right: 10px;
      width: 38px;
      height: 38px;
      border-radius: 4px;
    }

    .desc {
      display: flex;
      flex-direction: column;

      > span {
        display: block;
        color: var(--cp-tag);

        &:first-child {
          font-size: 16px;
          color: var(--cp-text2);
        }
      }
    }
  }

  &-price {
    ::v-deep() {
      .vam-cell__title {
        font-size: 16px;
      }

      .van-cell__value {
        font-size: 16px;
        color: var(--cp-price);
      }
    }
  }

  &-space {
    height: 12px;
    background-color: var(--cp-bg);
  }

  &-schema {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
      color: var(--cp-primary);
    }
  }

  ::v-deep() {
    .van-submit-bar__button {
      font-weight: normal;
      width: 160px;
      background-color: var(--cp-primary);
    }
  }
}
</style>
