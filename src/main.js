import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from './store'
// import './plugins/element.js'

import axios from 'axios'
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
  render: h => h(App)
}).$mount('#app')
