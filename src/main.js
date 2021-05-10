import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'

Vue.use(ElementUI)

// axios.defaults.baseURL = 'https://zusheng.club/api'
axios.defaults.baseURL = 'http://localhost:3000/api'
axios.defaults.headers['Content-Type'] = 'application/json'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

Vue.prototype.$axios = axios
Vue.config.productionTip = false
Vue.config.devtools = true

new Vue({
  router,
  store,
  created () {
    this.$store.commit('linkWsServer')
  },
  render: h => h(App)
}).$mount('#app')
