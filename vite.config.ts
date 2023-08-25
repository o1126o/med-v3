import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // 自动导入的插件，解析器可以是 vant element and-vue
    Components({
      dts: false,
      resolvers: [VantResolver({ importStyle: false })]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/dev-api': {
        target: 'http://consult-api.itheima.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev-api/, '')
      }
    }
  }
})
