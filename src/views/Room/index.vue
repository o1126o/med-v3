<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import io, { Socket } from 'socket.io-client'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import type { ConsultOrderItem } from '@/types/consult'
import { getConsultOrderDetail } from '@/servces/consult'
import { OrderType } from '@/enums'
import { showToast } from 'vant'

const store = useUserStore()
const route = useRoute()
const router = useRouter()

// 默认消息
import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'

// 时间格式化
import type { Image } from '@/types/consult'
import dayjs from 'dayjs'
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

let socket: Socket
onUnmounted(() => {
  socket.close()
})
const consult = ref<ConsultOrderItem>()

const list = ref<Message[]>([])

// 初始聊天状态
const initialMsg = ref(true)
onMounted(async () => {
  // 订单详情
  const res = await getConsultOrderDetail(route.query.orderId as string)
  console.log(res, '111')
  consult.value = res.data
  // 建立链接，创建 socket.io 实例
  socket = io('https://consult-api.itheima.net/', {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })
  // 建立连接成功
  socket.on('connect', () => {
    console.log('连接成功')
    list.value = []
    console.log(list.value, 'list')
  })
  // 是否断开连接
  socket.on('disconnect', () => {
    console.log('disconnect')
  })
  // 是否连接失败
  socket.on('error', (event) => {
    console.log('error')
  })
  // 聊天记录
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    // 准备转换成常规消息列表
    const arr: Message[] = []
    data.forEach((item, i) => {
      // 记录每一段消息中最早的消息时间，获取聊天记录需要使用
      // if (i === 0) time.value = item.createTime
      arr.push({
        msgType: MsgType.Notify,
        msg: { content: item.createTime },
        createTime: item.createTime,
        id: item.createTime
      })
      arr.push(...item.items)
    })
    // 追加到聊天列表
    list.value = arr
    console.log(list.value, '222')
    loading.value = false
    if (!data.length) {
      return showToast('没有聊天记录了')
    }
    // 第一次获取默认消息滚动到最底部
    if (initialMsg.value) {
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      // 第一次需要滚动到最新的消息
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      })
    }
  })
  // 订单状态 在onMounted注册
  socket.on('statusChange', async () => {
    const res = await getConsultOrderDetail(route.query.orderId as string)
    consult.value = res.data
  })
  // 接收消息 在onMounted注册
  socket.on('receiveChatMsg', async (event) => {
    console.log(event, '333')
    list.value.push(event)
    await nextTick()
    socket.emit('updateMsgStatus', event.id)
    window.scrollTo(0, document.body.scrollHeight)
  })
})

// 发送消息
const sendText = async (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    // 发送人
    from: store.user?.id,
    // 接收人
    to: consult.value?.docInfo?.id,
    // 消息类型
    msgType: MsgType.MsgText,
    // 消息内容
    msg: { content: text }
  })
}

// 发送图片
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 下拉刷新
const loading = ref(false)
const onRefresh = () => {
  // 触发下拉
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}

/* / 提供医生ID和订单ID  */
import { provide } from 'vue'
provide('consult', consult)
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="医生问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown"></room-status>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list" />
    </van-pull-refresh>
    <room-action
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImage"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);

  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
