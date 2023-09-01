// 问诊类型
export enum ConsultType {
  // 找医⽣
  Doctor = 1,
  // 快速问诊
  Fast = 2,
  // 开药问诊
  Medication = 3
}
// 问诊时间，以1⾃增可以省略
export enum IllnessTime {
  // ⼀周内
  Week = 1,
  // ⼀⽉内
  Month,
  // 半年内
  HalfYear,
  // 半年以上
  More
}
