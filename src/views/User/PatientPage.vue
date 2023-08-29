<script setup lang="ts">
import { getPatientList, addPatient, editPatient, delPatient } from '@/servces/patient'
import type { PatientList, Patients } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { showToast } from 'vant'
import Validator from 'id-validator'
import { showConfirmDialog } from 'vant'
// 1. ⻚⾯初始化加载数据
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data
  console.log(res.data)
}
onMounted(() => {
  loadList()
})

// 打开侧滑栏重置表单
const initPatient: Patients = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
const patient = ref<Patients>({ ...initPatient })

// 添加/修改患者
const handlePatiem = async () => {
  if (!patient.value.name) return showToast('请输⼊真实姓名')
  if (!patient.value.idCard) return showToast('请输⼊身份证号')
  const validate = new Validator()
  if (!validate.isValid(patient.value.idCard)) return showToast('身份证格式错误')
  const { sex } = validate.getInfo(patient.value.idCard)
  console.log(sex)
  console.log(patient.value.gender)
  if (patient.value.gender !== sex) return showToast('性别和身份证不符')
  console.log(patient.value.defaultFlag)
  patient.value.id ? await editPatient(patient.value) : await addPatient(patient.value)
  showRight.value = false
  loadList()
  showToast(patient.value.id ? '编辑成功' : '添加成功')
}

// 控制弹窗显示/隐藏
const showRight = ref(false)
const handleShow = (item?: Patients) => {
  // 打开侧滑栏重置表单
  if (item) {
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    patient.value = { ...initPatient }
  }
  showRight.value = true
}
const options = ref([
  {
    label: '男',
    value: 1
  },
  {
    label: '女',
    value: 0
  }
])
// 默认选中 默认值转换 默认值需要转换
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})

// 关闭弹出层
const backPopup = () => {
  showRight.value = false
}

// 删除
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ?`,
      cancelButtonText: '取消',
      confirmButtonText: '确认'
    })
    await delPatient(patient.value.id)
    showRight.value = false
    loadList()
    showToast('删除成功')
  }
}
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
      <div class="icon" @click="handleShow(item)"><cp-icon name="user-edit" /></div>
    </div>
    <div class="patient-add" v-if="list.length < 6" @click="handleShow">
      <cp-icon name="user-add" />
      <p>添加患者</p>
    </div>
    <div class="patient-tip">最多可添加 6 ⼈</div>

    <!-- 右侧弹出 -->
    <van-popup v-model:show="showRight" position="right" :style="{ width: '100%', height: '100%' }">
      <cp-nav-bar
        :back="backPopup"
        :title="patient.id ? '编辑患者' : '添加患者'"
        sidTitle="保存"
        @click-right="handlePatiem"
      ></cp-nav-bar>
      <van-form autocomplete="off">
        <van-field label="真实姓名" placeholder="请输⼊真实姓名" v-model="patient.name" />
        <van-field label="身份证号" placeholder="请输⼊身份证号" v-model="patient.idCard" />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              :options="options"
              v-model="patient.gender"
              @update:model-value="patient.gender = $event"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊⼈">
          <template #input>
            <van-checkbox round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="remove">删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
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

::v-deep() {
  .van-popup {
    padding-top: 46px;
    box-sizing: border-box;
  }
  // 底部操作栏
  .van-action-bar {
    padding: 0 10px;
    margin-bottom: 10px;
    .van-button {
      color: var(--cp-price);
      background-color: var(--cp-bg);
    }
  }
}
</style>
