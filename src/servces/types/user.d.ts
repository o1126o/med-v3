// 短信验证码类型，登录|注册|修改⼿机号|忘记密码|绑定⼿机号
export type CodeType = 'login' | 'register' | 'changeMobile' | 'forgetPassword' | 'bindMobile'

// // 用户信息
// export type User = {
//   token: string
//   id: string
//   account: string //⽤户名称
//   mobile: string
//   avatar: string
// }

// // 个⼈信息
// /* Pick 作⽤？
// 从类型对象中取出指定的属性类型
// Omit 作⽤？
// 从类型对象中排出指定的属性类型，得到剩余的 */
// type OmitUser = Omit<User, 'token'>
// export type UserInfo = OmitUser & {
//   likeNumber: number
//   collectionNumber: number
//   score: number
//   couponNumber: number
//   orderInfo: {
//     paidNumber: number
//     receivedNumber: number
//     shippedNumber: number
//     finishedNumber: number
//   }
// }
