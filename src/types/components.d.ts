import cpNavBar from '@/components/cp-nav-bar.vue'
import cpIcons from '@/components/cp-icons.vue'
import cpRadioBtn from '@/components/cp-radio-btn.vue'
import cpPaySheet from '@/components/cp-pay-sheet.vue'
declare module 'vue' {
  interface GlobalComponents {
    cpNavBar: typeof cpNavBar
    cpIcons: typeof cpIcons
    cpRadioBtn: typeof cpRadioBtn
    cpPaySheet: typeof cpPaySheet
  }
}
