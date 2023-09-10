<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMedicalOrderPre, getAddressList, createMedicalOrder } from '@/servces/order'
import type { OrderPre, AddressItem } from '@/types/order'
import { useRoute, useRouter } from 'vue-router'
import { showToast } from 'vant'
import { showConfirmDialog } from 'vant'
const route = useRoute()
const router = useRouter()

// 预支付信息
const orderPre = ref<OrderPre>()
// 获取处方id
const prescriptionId = route.query.id && route.query.id
// 获取药品信息
const loadOrderPre = async () => {
  const res = await getMedicalOrderPre({
    prescriptionId: prescriptionId as string
  })
  orderPre.value = res.data
}
loadOrderPre()

// 收货地址
const address = ref<AddressItem>()
const loadAddress = async () => {
  const addRes = await getAddressList()
  if (addRes.data.length) {
    const defAddress = addRes.data.find((item) => item.isDefault === 0)
    if (defAddress) address.value = defAddress
    else address.value = addRes.data[0]
  }
}
loadAddress()

// 支付显示
const show = ref(false)
// 生成订单
const agree = ref(false)
const loading = ref(false)
const orderId = ref('')
const submit = async () => {
  if (!agree.value) return showToast('请同意支付协议')
  if (!address.value?.id) return showToast('请选择收货地址')
  if (!orderPre.value?.id) return showToast('未找到处方')
  // 没有生成订单ID
  if (!orderId.value) {
    try {
      loading.value = true
      const res = await createMedicalOrder({
        id: orderPre.value?.id,
        addressId: address.value?.id,
        couponId: orderPre.value.couponId
      })
      orderId.value = res.data.id
      loading.value = false
      // 打开支付抽屉
      show.value = true
    } catch (e) {
      loading.value = false
    }
  } else {
    show.value = true
  }
}

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
      return true
    })
}
</script>

<template>
  <div class="order-pay" v-if="orderPre && address">
    <cp-nav-bar title="药品支付" />
    <div class="order-pay-address">
      <p class="area">
        <van-icon name="location" />
        <span>{{ address?.province }}{{ address?.city }}{{ address?.county }}</span>
      </p>
      <p class="detail">{{ address?.addressDetail }}</p>
      <!-- 手机号要进行加密 -->
      <p>
        {{ address?.receiver }} {{ address?.mobile.replace(/^(\d{3})\d+(\d{4})$/, '\$1****\$2') }}
      </p>
    </div>
    <div class="order-pay-medical">
      <div class="head">
        <h3>优医药房</h3>
        <small>优医质保 假一赔十</small>
      </div>
      <div class="item van-hairline--top" v-for="i in orderPre?.medicines" :key="i.id">
        <img class="img" :src="i.avatar" alt="" />
        <div class="info">
          <p class="name">
            <span>{{ i.name }}</span>
            <span>x{{ i.quantity }}</span>
          </p>
          <p class="size">
            <van-tag v-if="i.prescriptionFlag === 1">处方药</van-tag>
            <span>{{ i.specs }}</span>
          </p>
          <p class="price">￥{{ i.amount }}</p>
        </div>
        <div class="desc">用法用量: {{ i.usageDosag }}</div>
      </div>
    </div>
    <div class="order-pay-detail">
      <van-cell-group>
        <van-cell title="药品金额" :value="`￥${orderPre?.payment}`" />
        <van-cell title="运费" :value="`￥${orderPre?.expressFee}`" />
        <van-cell title="优惠券" :value="`-￥${orderPre?.couponDeduction}`" />
        <van-cell title="实付款" :value="`￥${orderPre?.actualPayment}`" class="price" />
      </van-cell-group>
    </div>
    <div class="order-pay-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出
        不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="agree">我已同意<a href="javascript:;">支付协议</a></van-checkbox>
    </div>
    <van-submit-bar
      :price="orderPre.actualPayment * 100"
      button-text="立即支付"
      button-type="primary"
      text-align="left"
      @click="submit"
      :loading="loading"
    ></van-submit-bar>
    <!-- 支付 -->
    <cp-pay-sheet
      v-model:show="show"
      :orderId="orderId"
      :actualPayment="orderPre.actualPayment"
      payCallback="order/pay/result"
      :onClose="onClose"
    />
  </div>
  <div class="order-pay" v-else>
    <cp-nav-bar title="药品支付" />
    <van-skeleton title avatar row="2" style="margin-top: 15px" />
    <van-skeleton title row="4" style="margin-top: 50px" />
    <van-skeleton title row="4" style="margin-top: 50px" />
  </div>
</template>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);

  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}

:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
  }

  .van-cell__value {
    font-size: 16px;
  }

  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}

:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

  .van-button {
    width: 200px;
    background-color: var(--cp-primary);
  }
}

.order-pay {
  padding: 46px 0 65px;

  &-address {
    padding: 15px 15px 0 15px;
    background-color: #fff;
    font-size: 13px;

    .area {
      color: var(--cp-tag);
      margin-bottom: 5px;

      .van-icon-location {
        color: #ff7702;
        font-size: 14px;
      }
    }

    .detail {
      font-size: 17px;
      margin-bottom: 5px;
    }

    &::after {
      content: '';
      display: block;
      height: 12px;
      background-color: var(--cp-bg);
      margin: 0 -15px;
      margin-top: 15px;
    }
  }

  &-medical {
    background-color: #fff;
    padding: 0 15px;

    .head {
      display: flex;
      height: 54px;
      align-items: center;

      > h3 {
        font-size: 16px;
        font-weight: normal;
      }

      > small {
        font-size: 13px;
        color: var(--cp-tag);
        margin-left: 10px;
      }
    }

    .item {
      display: flex;
      flex-wrap: wrap;
      padding: 15px 0;

      .img {
        width: 80px;
        height: 70px;
        border-radius: 2px;
        overflow: hidden;
      }

      .info {
        padding-left: 15px;
        width: 250px;

        .name {
          display: flex;
          font-size: 15px;
          margin-bottom: 5px;

          > span:first-child {
            width: 200px;
          }

          > span:last-child {
            width: 50px;
            text-align: right;
          }
        }

        .size {
          margin-bottom: 5px;

          .van-tag {
            background-color: var(--cp-primary);
            vertical-align: middle;
          }

          span:not(.van-tag) {
            margin-left: 10px;
            color: var(--cp-tag);
            vertical-align: middle;
          }
        }

        .price {
          font-size: 16px;
          color: #eb5757;
        }
      }

      .desc {
        width: 100%;
        background-color: var(--cp-bg);
        border-radius: 4px;
        margin-top: 10px;
        padding: 4px 10px;
        color: var(--cp-tip);
      }
    }
  }

  &-tip {
    padding: 0 15px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;

    .tip {
      font-size: 12px;
      color: var(--cp-tag);
      width: 100%;

      &::before {
        content: '*';
        color: var(--cp-price);
        font-size: 14px;
      }

      margin-bottom: 30px;
    }

    .van-checkbox {
      a {
        color: var(--cp-primary);
      }
    }
  }
}
</style>
