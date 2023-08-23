/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        // userTabs:使用tab缩进还是空格缩进，选择false
        userTabs: false,
        // tabWidth:tab是空格情况下，是几个空格，选择两个
        tabWidth: 2,
        // printWidth：当行字符的长度，推荐80
        printWidth: 100,
        // singleQuote 使用单引号还是双引号，选择true,使用单引号
        singleQuote: true,
        // trailingComma 在多行输入的尾逗号是否添加，设置'none'
        trailingComma: 'none',
        // semi 语句末尾是否要加分号，默认值true,选择false不加
        semi: false
      }
    ],
    // vue 组件需要⼤驼峰命名，除去 index 之外，App 是默认⽀持的
    'vue/multi-word-component-names': [
      'warn',
      {
        ignores: ['index']
      }
    ],
    // vue/no-setup-props-destructure是一个ESLint规则，用于检测Vue 3中的组件选项setup()函数中是否对props进行解构赋值。
    'vue/no-setup-props-destructure': ['off']
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
