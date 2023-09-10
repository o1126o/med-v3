import type { Medical } from './room'

// 获取药品支付页面参数类型
export type MedicineType = {
  /**
   * 使用优惠券，需要传此值，不使用优惠券，不传
   */
  couponId?: string
  /**
   * 处方id
   */
  prescriptionId: string
  /**
   * 不传，默认值1，即使用优惠券
   * 传0，不使用优惠券
   * 其中，不传优惠券id,默认按照最大优惠券使用，
   * 传了优惠券id,表示使用指定的优惠券
   */
  useCoupon?: string
}

// 药品详情
export type OrderPre = {
  /** 处方ID */
  id: string
  /** 优惠券ID */
  couponId: string
  /** 积分抵扣 */
  pointDeduction: number
  /** 优惠券抵扣 */
  couponDeduction: number
  /** 应付款 */
  payment: number
  /** 邮费 */
  expressFee: number
  /** 实付款 */
  actualPayment: number
  /** 药品订单 */
  medicines: Medical[]
}

// 物流
export type AddressItem = {
  /** 地址ID */
  id: string
  /** 联系方式 */
  mobile: string
  /** 收件人 */
  receiver: string
  /** 省 */
  province: string
  /** 市 */
  city: string
  /** 区 */
  county: string
  /** 详细地址 */
  addressDetail: string
  /** 是否默认地址，0 不是 1 是 */
  isDefault: 0 | 1
}

type Address = Omit<AddressItem, 'isDefault'>

// 订单物流
export type OrderDetail = {
  /** 药品订单ID */
  id: string
  /** 药品订单编号 */
  orderNo: string
  /** 订单类型 */
  type: number
  /** 创建时间 */
  createTime: string
  /** 处方ID */
  prescriptionId: string
  /** 订单状态 */
  status: OrderType
  /** 订单状态说明 */
  statusValue: string
  /** 药品清单 */
  medicines: Medical[]
  /** 支付倒计时时间 */
  countDown: number
  /** 收货地址 */
  addressInfo: Address
  /** 物流信息 */
  expressInfo: {
    /** 物流最新位置 */
    content: string
    /** 物流最新时间 */
    time: string
  }
  /** 支付时间 */
  payTime: string
  /** 支付方式 */
  paymentMethod?: 0 | 1
  /** 支付金额 */
  payment: number
  /** 积分抵扣 */
  pointDeduction: number
  /** 优惠券抵扣 */
  couponDeduction: number
  /** 邮费 */
  expressFee: number
  /** 实付金额 */
  actualPayment: number
  /** 问诊室ID */
  roomId: string
}

// 物流详情
export type Express = {
  /** 物流信息ID */
  id: string
  /** 物流内容 */
  content: string
  /** 创建时间 */
  createTime: string
  /** 物流状态 */
  status: ExpressStatus
  /** 状态文章 */
  statusValue: string
}

// 地图经纬度
export type Location = {
  /** 经度 */
  longitude: string
  /** 纬度 */
  latitude: string
}

// 物流运输详情
export type Logistics = {
  /** 预计送达时间 */
  estimatedTime: string
  /** 物流公司名称 */
  name: string
  /** 物流编号 */
  awbNo: string
  /** 最新物流状态 */
  status: ExpressStatus
  /** 最新物流状态文字 */
  statusValue: string
  /** 物流信息数组 */
  list: Express[]
  /** 轨迹信息数组 */
  logisticsInfo: Location[]
  /** 当前运输位置 */
  currentLocationInfo: Location
}
