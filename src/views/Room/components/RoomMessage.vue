<script setup lang="ts">
import { useShowPrescription } from '@/composable'
const { onShowPrescription } = useShowPrescription()
import { useRouter } from 'vue-router'
import { MsgType, PrescriptionStatus } from '@/enums'
import { showToast, showImagePreview } from 'vant'
import type { Message, Prescription } from '@/types/room'
import { IllnessTime } from '@/enums'
import { flagOptions, timeOptions } from '@/servces/constants'
import { useUserStore } from '@/stores'
const store = useUserStore()
// 点击处方的跳转
const router = useRouter()
const buy = (pre?: Prescription) => {
  if (pre) {
    if (pre.status === PrescriptionStatus.Invalid) return showToast('处方已失效')
    if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
      return router.push(`/order/pay?id=${pre.id}`)
    router.push(`/order/${pre.orderId}`)
  }
}

// 接受父组件传递数据
defineProps<{ list: Message[] }>()

// 文字
const getIllnessTimeText = (time: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label
// 状态
const getConsultFlagText = (flag: 0 | 1) => flagOptions.find((item) => item.value === flag)?.label

import type { Image } from '@/types/consult'
// 图片
const previewImg = (pictures?: Image[]) => {
  if (pictures && pictures.length) showImagePreview(pictures.map((item) => item.url))
}

import dayjs from 'dayjs'

const formatTime = (time: string) => dayjs(time).format('HH:mm')
</script>

<template v-for="{ msgType, msg, createTime, from, fromAvatar } in list" :key="msg.id">
  <!-- 患者卡片 -->
  <div class="msg msg-illness" v-if="msg === MsgType.CardPat">
    <div class="patient van-hairline--bottom" v-if="msg.consultRecord">
      <p>
        {{ msg.consultRecord.patientInfo.name }}
        {{ msg.consultRecord.patientInfo.genderValue }}
        {{ msg.consultRecord.patientInfo.age }}岁
      </p>
      <p>
        {{ getIllnessTimeText(msg.consultRecord.illnessTime) }} |
        {{ getConsultFlagText(msg.consultRecord.consultFlag) }}
      </p>
    </div>
    <van-row>
      <van-col span="6">病情描述</van-col>
      <van-col span="18">{{ msg.consultRecord.illnessTime }}</van-col>
      <van-col span="6">图片</van-col>
      <van-col span="18" @click="previewImg(msg.consultRecord?.pictures)">点击查看</van-col>
    </van-row>
  </div>
  <!-- 通知-温馨提示 -->
  <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
    <div class="content">
      <span class="green">温馨提示：</span>
      <span>{{ msg.content }}</span>
    </div>
  </div>
  <!-- 通知通知 -->
  <div class="msg msg-tip msg-tip-cancel" v-if="msgType === 31">
    <div class="content">
      <span>{{ msg.content }}</span>
    </div>
  </div>
  <!-- 我的 发送文字 -->
  <div class="msg msg-to" v-if="msgType === MsgType.MsgText && store.user?.id === from">
    <div class="content">
      <div class="time">{{ formatTime(createTime) }}</div>
      <van-image fit="contain" :src="msg.picture?.url" />
    </div>
    <van-image :src="store.user?.avatar" />
  </div>
  <!-- 发送图片 -->
  <!-- <div class="msg msg-to">
    <div class="content">
      <div class="time">20:12</div>
      <van-image fit="contain" src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    </div>
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
  </div> -->
  <!-- 医生 接收文字 -->
  <div class="msg msg-from" v-if="msgType === MsgType.MsgText && store.user?.id !== from">
    <van-image :src="avatar" />
    <div class="content">
      <div class="time">{{ formatTime(createTime) }}</div>
      <van-image fit="contain" :src="msg.picture?.url" />
    </div>
  </div>
  <!--  接收图片 -->
  <!-- <div class="msg msg-from">
    <van-image src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    <div class="content">
      <div class="time">20:12</div>
      <van-image fit="contain" src="https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/popular_3.jpg" />
    </div>
  </div> -->
  <!-- 处方卡片 -->
  <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
    <div class="content" v-if="msg.prescription">
      <div class="head van-hairline--bottom">
        <div class="head-tit">
          <h3>电子处方</h3>
          <p @click="showPrescription(msg.prescription?.id)">
            原始处方 <van-icon name="arrow"></van-icon>
          </p>
        </div>
        <p>
          {{ msg.prescription.name }}
          {{ msg.prescription.genderValue }}
          {{ msg.prescription.age }}岁
          {{ msg.prescription.diagnosis }}
        </p>
        <p>开方时间：{{ msg.prescription.createTime }}</p>
      </div>
      <div class="body">
        <div class="body-item" v-for="med in msg.prescription.medicines" :key="med.id">
          <div class="durg">
            <p>{{ med.name }} {{ med.specs }}</p>
            <p>{{ med.usageDosag }}</p>
          </div>
          <div class="num">x{{ med.quantity }}</div>
        </div>
      </div>
      <div class="foot">
        <span @click="buy(msg.prescription)">购买药品</span>
      </div>
    </div>
  </div>

  <!-- 评价卡片，后期实现 -->
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
