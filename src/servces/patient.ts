import request from '@/utils/request'
import type { PatientList, Patients } from '@/types/user.d'
// 获患者信息列表
export const getPatientList = () => request<PatientList>('/patient/mylist')

// 添加患者信息
export const addPatient = (patient: Patients) => request('/patient/add', 'POST', patient)

// 编辑患者信息
export const editPatient = (patient: Patients) => request('/patient/update', 'PUT', patient)

// 删除患者信息
export const delPatient = (id: string) => request(`/patient/del/${id}`, 'DELETE')
