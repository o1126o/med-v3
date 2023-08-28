// 用户信息
export type User =
  | {
      token: string
      id: string
      account: string //⽤户名称
      mobile: string
      avatar: string
    }
  | undefined

// 匹配出非token字段的类型
type OmitUser = Omit<User, 'token'>

// 用户信息类型
export type UserInfo = OmitUser & {
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  orderInfo: {
    paidNumber: number
    receivedNumber: number
    shippedNumber: number
    finishedNumber: number
  }
}
