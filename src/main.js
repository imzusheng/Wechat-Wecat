import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI)

axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'https://chat.zusheng.club/wechatAPI' : 'http://localhost:3300/wechatAPI'
axios.defaults.headers['Content-Type'] = 'application/json'
// 请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
/** 响应拦截器如果放在new Vue上面的话，无法获取到$store */
// 响应拦截器
axios.interceptors.response.use(response => {
  if (response.data.type === 401 && response.data.error) {
    return store.commit('authHandle', response)
  }
  return response
}, error => {
  throw error
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  store,
  router,
  created () {
    // 连接ws服务器
    this.$store.commit('linkWsServer')
  },
  render: h => h(App)
}).$mount('#app')
