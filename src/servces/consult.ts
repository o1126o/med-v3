import type { TopDep, Image } from '@/types/consult'
import request from '@/utils/request'

// 科室
export const getAllDep = () => request<TopDep[]>('/dep/all')

// 图片上传
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('/upload', 'POST', fd)
}
