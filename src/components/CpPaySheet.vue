<script setup lang="ts">
import { showToast, showLoadingToast } from 'vant'
import { ref } from 'vue'
import { getConsultOrderPayUrl } from '@/servces/consult'

const props = defineProps<{
  orderId: string
  actualPayment: number
  onClose?: () => void
  show: boolean
}>()
const emit = defineEmits<{
  (e: 'update:show', val: boolean): void
}>()
const paymentMethod = ref<0 | 1>()
// 跳转支付
const pay = async () => {
  if (paymentMethod.value === undefined) return showToast('请选择支付方式')
  showLoadingToast({ message: '跳转支付', duration: 0 })
  const res = await getConsultOrderPayUrl({
    paymentMethod: paymentMethod.value,
    orderId: props.orderId,
    payCallback: 'http://localhost:5173/room'
  })
  window.location.href = res.data.payUrl
}
</script>

<template>
  <div class="sheet-page">
    <van-action-sheet
      :show="show"
      @update:show="emit('update:show', $event)"
      title="选择⽀付⽅式"
      :close-on-popstate="false"
      :closeable="false"
      :beforeClose="onClose"
    >
      <div class="pay-type">
        <p class="amount">￥{{ actualPayment?.toFixed(2) }}</p>
        <van-cell-group>
          <van-cell title="微信⽀付" @click="paymentMethod = 0">
            <template #icon><cp-icon name="consult-wechat" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 0" /></template>
          </van-cell>
          <van-cell title="⽀付宝⽀付" @click="paymentMethod = 1">
            <template #icon><cp-icon name="consult-alipay" /></template>
            <template #extra><van-checkbox :checked="paymentMethod === 1" /></template>
          </van-cell>
        </van-cell-group>
        <div class="btn">
          <van-button type="primary" round block @click="pay">⽴即⽀付</van-button>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style lang="scss" scoped>
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }

  .btn {
    padding: 15px;
  }

  .van-cell {
    align-items: center;

    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }

    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
