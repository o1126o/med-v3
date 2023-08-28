<script setup lang="ts">
import { getPatientList } from '@/servces/user'
import type { PatientList } from '@/types/user'
import { onMounted, ref } from 'vue'
// 1. ⻚⾯初始化加载数据
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data.data
  console.log(res.data.data)
}
onMounted(() => {
  loadList()
})
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-item" v-for="item in list" :key="item.id">
      <div class="info">
        <p>
          <span class="name">{{ item.name }}</span>
          <span class="id">{{ item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, '\$1******\$2') }}</span>
        </p>
        <p>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </p>
      </div>
      <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      <div class="icon"><cp-icon name="user-edit" /></div>
    </div>
    <div class="patient-add" v-if="list.length < 6">
      <cp-icon name="user-add" />
      <p>添加患者</p>
    </div>
    <div class="patient-tip">最多可添加 6 ⼈</div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 50px 0 80px;
  box-sizing: border-box;
}

.patient-item {
  background-color: var(--cp-bg);
  display: flex;
  justify-content: space-between;
  margin: 10px;
  border-radius: 5px;
  padding: 20px;
  align-items: center;

  .info {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;

    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
    }

    .name {
      font-size: 16px;
      color: var(--cp-text1);
      width: 80px;
      display: inline-block;
      width: 70px;
    }

    .id {
      color: var(--cp-text2);
      width: 180px;
    }
  }

  .icon {
    color: var(--cp-dark);
  }

  .tag {
    background-color: var(--cp-primary);
    color: #fff;
    font-size: 10px;
    border-radius: 2px;
    padding: 1px 2px;
    margin-bottom: 30px;
  }
}

.patient-tip {
  color: var(--cp-tag);
  margin-left: 15px;
}

.patient-add {
  background-color: var(--cp-bg);
  display: flex;
  margin: 10px;
  border-radius: 5px;
  padding: 20px;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  color: var(--cp-primary);

  .cp-icon {
    font-size: 20px;
    margin-bottom: 5px;
  }
}
</style>
