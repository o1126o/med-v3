<script setup lang="ts">
import type { ConsultOrderItem } from '@/types/consult'
import { OrderType } from '@/enums'
import { useCancelOrder, useDeleteOrder, useShowPrescription } from '@/composable'
const { onShowPrescription } = useShowPrescription()
import ConsultMore from './ConsultMore.vue'

// 接受父组件传过来的数据
const props = defineProps<{ item: ConsultOrderItem }>()

const emit = defineEmits<{
  (e: 'on-delete', id: string): void
}>()

// // 取消、删除订单
const { loading, cancelConsultOrder } = useCancelOrder()
const { loading: deleteLoading, deleteConsultOrder } = useDeleteOrder(() => {
  emit('on-delete', props.item.id)
})
</script>

<template>
  <div class="consult-item">
    <div class="head">
      <img src="@/assets/avatar-doctor.svg" alt="" />
      <p class="title">{{ item.docInfo?.name || '暂未分配医生' }}</p>
      <p
        class="pays"
        :class="{
          orange: item.status === OrderType.ConsultPay,
          green: item.status === OrderType.ConsultChat
        }"
      >
        {{ item.statusValue }}
      </p>
    </div>
    <div class="center">
      <p class="center-row">
        <span class="center-label">病情描述</span>
        <span class="center-value">{{ item.illnessDesc }}</span>
      </p>
      <p class="center-row">
        <span class="center-label">价格</span>
        <span class="center-value">￥{{ item.payment.toFixed(2) }}</span>
      </p>
      <p class="center-row">
        <span class="center-label">创建时间</span>
        <span class="center-value tip">{{ item.createTime }}</span>
      </p>
    </div>
    <!-- 待支付：取消问诊+去支付 -->
    <div class="foot" v-if="item.status === OrderType.ConsultPay">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="loading"
        @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button
        class="primary"
        type="primary"
        plain
        size="small"
        round
        :to="`/user/consult/${item.id}`"
        >去支付</van-button
      >
    </div>
    <!-- 待接诊：取消问诊+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultWait">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="loading"
        @click="cancelConsultOrder(item)"
        >取消问诊</van-button
      >
      <van-button
        class="primary"
        type="primary"
        plain
        size="small"
        round
        :to="`/room?orderId=${item.id}`"
        >继续沟通</van-button
      >
    </div>
    <!-- 咨询中：查看处方（如果开了）+继续沟通 -->
    <div class="foot" v-if="item.status === OrderType.ConsultChat">
      <van-button
        class="gray"
        plain
        size="small"
        round
        v-if="item.prescriptionId"
        @click="onShowPrescription(item.prescriptionId)"
        >查看处方</van-button
      >
      <van-button
        class="primary"
        type="primary"
        plain
        size="small"
        round
        :to="`/room?orderId=${item.id}`"
        >继续沟通</van-button
      >
    </div>
    <!-- 已完成：更多（查看处方，如果开了，删除订单）+问诊记录+（未评价?写评价:查看评价） -->
    <div class="foot" v-if="item.status === OrderType.ConsultComplete">
      <ConsultMore
        :disabled="!item.prescriptionId"
        @on-delete="deleteConsultOrder(item)"
        @on-preview="onShowPrescription(item.prescriptionId)"
      ></ConsultMore>
      <van-button class="gray" plain size="small" round :to="`/room?orderId=${item.id}`"
        >问诊记录</van-button
      >
      <van-button
        class="primary"
        type="primary"
        plain
        size="small"
        round
        v-if="!item.evaluateId"
        :to="`/room?orderId=${item.id}`"
        >去评价</van-button
      >
      <van-button class="gray" plain size="small" :to="`/room?orderId=${item.id}`" round v-else
        >查看评价</van-button
      >
    </div>
    <!-- 已取消：删除订单+咨询其他医生 -->
    <div class="foot" v-if="item.status === OrderType.ConsultCancel">
      <van-button
        class="gray"
        plain
        size="small"
        round
        :loading="deleteLoading"
        @click="deleteConsultOrder(item)"
        >删除订单</van-button
      >
      <van-button class="primary" type="primary" plain size="small" round to="/"
        >咨询其他医生</van-button
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consult-item {
  background-color: #fff;
  border-radius: 5px;
  box-sizing: border-box;
  margin-bottom: 10px;

  .head {
    border-bottom: 1px solid var(--cp-line);
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 15px;

    img {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }

    .title {
      flex: 1;
      font-size: 15px;
    }

    .pays {
      color: var(--cp-orange);
    }
  }

  .center {
    padding: 15px;

    .center-row {
      margin: 10px 0;

      .center-label {
        color: var(--cp-dark);
        width: 70px;
        display: inline-block;
        font-size: 13px;
      }

      .center-value {
        width: 250px;
      }

      .tip {
        color: var(--cp-tag);

        &.orange {
          color: #f2994a;
        }

        &.green {
          color: var(--cp-primary);
        }
      }
    }
  }

  .foot {
    padding: 0 15px 15px 15px;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .van-button {
      margin-left: 10px;
      padding: 0 16px;

      &.gray {
        color: var(--cp-text3);
        background-color: var(--cp-bg);
      }

      &.primary {
        color: var(--cp-primary);
        border: 1px solid var(--cp-primary);
      }
    }

    .more {
      color: var(--cp-tag);
      flex: 1;
      font-size: 13px;
    }
  }
}
</style>
