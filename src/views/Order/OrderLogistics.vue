<script setup lang="ts">
import { useRoute } from 'vue-router'
import { getMedicalOrderLogistics } from '@/servces/order'
import type { Logistics, Location } from '@/types/order'
import { onMounted, ref } from 'vue'
import startImg from '@/assets/start.png'
import endImg from '@/assets/end.png'
import carImg from '@/assets/car.png'
const route = useRoute()
// 获取物流信息
const logistics = ref<Logistics>()
const initLogisticsDetail = async () => {
  const res = await getMedicalOrderLogistics(route.params.id as string)
  console.log(res)
  logistics.value = res.data
}
// 高德地图
import AMapLoader from '@amap/amap-jsapi-loader'
// 配置jscode
window._AMapSecurityConfig = {
  securityJsCode: '415e917da833efcf2d5b69f4d821784b'
}
onMounted(async () => {
  initLogisticsDetail()
  AMapLoader.load({
    key: '4eed3d61125c8b9c168fc22414aaef7e',
    version: '2.0'
  })
    .then((AMap) => {
      // 初始化地图
      const map = new AMap.Map('map', {
        // s设置缩放比
        zoom: 12,
        // 给地图设置孩子主题
        mapStyle: 'amap://styles/whitesmoke'
      })

      AMap.plugin('AMap.Driving', function () {
        let driving = new AMap.Driving({
          map: map,
          // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
          policy: AMap.DrivingPolicy.LEAST_TIME,
          showTraffic: false,
          hideMarkers: true
        })

        if (logistics.value?.logisticsInfo && logistics.value.logisticsInfo.length >= 2) {
          const list = [...logistics.value.logisticsInfo]
          let startLngLat = list.shift()
          let endLngLat = list.pop()

          const getMarker = (point: Location, image: string, width = 25, height = 30) => {
            const icon = new AMap.Icon({
              size: new AMap.Size(width, width), // 图标尺寸
              image: image, // Icon的图像
              imageSize: new AMap.Size(width, height)
            })

            // 将 Icon 实例添加到 marker 上:
            const marker = new AMap.Marker({
              position: [point?.longitude, point?.latitude],
              icon: icon, // 添加 Icon 实例
              zoom: 13
            })

            return marker
          }
          const startMarker = getMarker(endLngLat!, startImg)
          map.add(startMarker)
          const endMarker = getMarker(startLngLat!, endImg)
          map.add(endMarker)

          driving.search(
            [startLngLat?.longitude, startLngLat?.latitude],
            [endLngLat?.longitude, endLngLat?.latitude],
            // 途径地点经纬度
            {
              waypoints: list.map((item) => [item.longitude, item.latitude])
            },
            // 路线规划完成之后出发的方法
            function () {
              // 当前车辆的位置
              const curr = logistics.value?.currentLocationInfo

              // 添加车辆标注点
              const currMarker = getMarker(curr!, carImg, 33, 20)

              map.add(currMarker)

              setTimeout(() => {
                map.setFitView([currMarker])
                map.setZoom(10)
              }, 3000)
            }
          )
        }
      })
    })
    .catch((e) => {
      console.log(e) //加载错误提示
    })
})
</script>

<template>
  <div class="order-logistics-page">
    <div id="map">
      <div class="title">
        <van-icon name="arrow-left" @click="$router.back()" />
        <span>{{ logistics?.statusValue }}</span>
        <van-icon name="service" />
      </div>
      <div class="current">
        <p class="status">{{ logistics?.statusValue }} 预计{{ logistics?.estimatedTime }}送达</p>
        <p class="predict">
          <span>{{ logistics?.name }}</span>
          <span>{{ logistics?.awbNo }}</span>
        </p>
      </div>
    </div>
    <div class="logistics">
      <p class="title">物流详情</p>
      <van-steps direction="vertical" :active="0">
        <van-step v-for="item in logistics?.list" :key="item.id">
          <p class="status">{{ item.statusValue }}</p>
          <p class="content">{{ item.content }}</p>
          <p class="time">{{ item.createTime }}</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-logistics-page {
  --van-step-icon-size: 18px;
  --van-step-circle-size: 10px;
}

#map {
  height: 450px;
  background-color: var(--cp-bg);
  overflow: hidden;
  position: relative;

  .title {
    background-color: #fff;
    height: 46px;
    width: 355px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    font-size: 16px;
    position: absolute;
    left: 10px;
    top: 10px;
    box-sizing: border-box;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    > span {
      flex: 1;
      text-align: center;
    }

    .van-icon {
      font-size: 18px;
      color: #666;

      &:last-child {
        color: var(--cp-primary);
      }
    }
  }

  .current {
    height: 80px;
    border-radius: 4px;
    background-color: #fff;
    height: 80px;
    width: 355px;
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    left: 10px;
    bottom: 10px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);
    z-index: 999;

    .status {
      font-size: 15px;
      line-height: 26px;
    }

    .predict {
      color: var(--cp-tip);
      font-size: 13px;
      margin-top: 5px;

      > span {
        padding-right: 10px;
      }
    }
  }
}

.logistics {
  padding: 0 10px 20px;

  .title {
    font-size: 16px;
    padding: 15px 5px 5px;
  }

  .van-steps {
    :deep(.van-step) {
      &::after {
        display: none;
      }
    }

    .status {
      font-size: 15px;
      color: var(--cp-text3);
      margin-bottom: 4px;
    }

    .content {
      font-size: 13px;
      color: var(--cp-tip);
      margin-bottom: 4px;
    }

    .time {
      font-size: 13px;
      color: var(--cp-tag);
    }
  }
}
</style>
