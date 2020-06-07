import Vue from 'vue'
import App from './App'
import router from './router/router'

Vue.config.productionTip = false

// eslint-disable-next-line no-new
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

/*
import Vue from 'vue/dist/vue.esm.js'
new Vue({
  el: '#app',
  template: `
    <App/>
  `,
  router,
  components: {
    App
  }
})
// Vue的两种形式
// compiler（模板）模式和runtime模式（运行时）
// 运行时模式无法直接使用模板 template
 */
