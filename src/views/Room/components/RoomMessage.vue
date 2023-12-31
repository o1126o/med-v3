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
import EvaluateCard from './EvaluateCard.vue'
const store = useUserStore()
// 点击处方的跳转,购买药品
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

import { getPrescriptionPic } from '@/servces/consult'

const showPrescription = async (id?: string) => {
  if (id) {
    const res = await getPrescriptionPic(id)
    showImagePreview([res.data.url])
  }
}
</script>

<template>
  <div class="room-message">
    <template v-for="(item, index) in list" :key="index">
      <!-- 患者卡片 -->
      <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
        <div class="patient van-hairline--bottom" v-if="item.msg.consultRecord">
          <p>
            {{ item.msg.consultRecord.patientInfo.name }}
            {{ item.msg.consultRecord.patientInfo.genderValue }}
            {{ item.msg.consultRecord.patientInfo.age }}岁
          </p>
          <p>
            {{ getIllnessTimeText(item.msg.consultRecord.illnessTime) }} |
            {{ getConsultFlagText(item.msg.consultRecord.consultFlag) }}
          </p>
        </div>
        <van-row>
          <van-col span="6">病情描述</van-col>
          <van-col span="18">{{ item.msg.consultRecord?.illnessTime }}</van-col>
          <van-col span="6">图片</van-col>
          <van-col span="18" @click="previewImg(item.msg.consultRecord?.pictures)"
            >点击查看</van-col
          >
        </van-row>
      </div>
      <!-- 通知-温馨提示 -->
      <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
        <div class="content">
          <span class="green">温馨提示：</span>
          <span>{{ item.msg.content }}</span>
        </div>
      </div>
      <!-- 通知通知 -->
      <div class="msg msg-tip msg-tip-cancel" v-if="item.msgType === 31">
        <div class="content">
          <span>{{ item.msg.content }}</span>
        </div>
      </div>
      <!-- 我的 发送文字 -->
      <div
        class="msg msg-to"
        v-if="item.msgType === MsgType.MsgText && store.user?.id === item.from"
      >
        <div class="content">
          <div class="time">{{ formatTime(item.createTime) }}</div>
          <div class="pao">{{ item.msg.content }}</div>
        </div>
        <van-image :src="store.user?.avatar" />
      </div>
      <!-- 发送图片 -->
      <div
        class="msg msg-to"
        v-if="item.msgType === MsgType.MsgImage && store.user?.id === item.from"
      >
        <div class="content">
          <div class="time">{{ formatTime(item.createTime) }}</div>
          <van-image fit="contain" :src="item.msg.picture?.url" />
        </div>
        <van-image :src="store.user?.avatar" />
      </div>
      <!-- 医生 接收文字 -->
      <div
        class="msg msg-from"
        v-if="item.msgType === MsgType.MsgText && store.user?.id !== item.from"
      >
        <van-image :src="item.fromAvatar" />
        <div class="content">
          <div class="time">{{ formatTime(item.createTime) }}</div>
          <div class="pao">{{ item.msg.content }}</div>
        </div>
      </div>
      <!--  接收图片 out -->
      <div
        class="msg msg-from"
        v-if="item.msgType === MsgType.MsgImage && store.user?.id !== item.from"
      >
        <van-image :src="item.fromAvatar" />
        <div class="content">
          <div class="time">{{ formatTime(item.createTime) }}</div>
          <van-image fit="contain" :src="item.msg.picture?.url" />
        </div>
      </div>
      <!-- 处方卡片 -->
      <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
        <div class="content" v-if="item.msg.prescription">
          <div class="head van-hairline--bottom">
            <div class="head-tit">
              <h3>电子处方</h3>
              <p @click="showPrescription(item.msg.prescription?.id)">
                原始处方 <van-icon name="arrow"></van-icon>
              </p>
            </div>
            <p>
              {{ item.msg.prescription.name }}
              {{ item.msg.prescription.genderValue }}
              {{ item.msg.prescription.age }}岁
              {{ item.msg.prescription.diagnosis }}
            </p>
            <p>开方时间：{{ item.msg.prescription.createTime }}</p>
          </div>
          <div class="body">
            <div class="body-item" v-for="med in item.msg.prescription.medicines" :key="med.id">
              <div class="durg">
                <p>{{ med.name }} {{ med.specs }}</p>
                <p>{{ med.usageDosag }}</p>
              </div>
              <div class="num">x{{ med.quantity }}</div>
            </div>
          </div>
          <div class="foot">
            <span @click="buy(item.msg.prescription)">购买药品</span>
          </div>
        </div>
      </div>
      <!-- 结束后问诊信息 -->
      <div class="msg msg-tip msg-tip-cancel" v-if="item.msgType === MsgType.NotifyCancel">
        <div class="content">
          <span>{{ item.msg.content }}</span>
        </div>
      </div>
      <!-- 评价卡片，后期实现 -->
      <div
        class="msg msg-comment"
        v-if="item.msgType === MsgType.CardEva || item.msgType === MsgType.CardEvaForm"
      >
        <evaluate-card :evaluateDoc="item.msg.evaluateDoc" />
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
