import axios from 'axios'

export class axiosHttp {
  constructor (url) {
    axios.defaults.baseURL = url
    axios.defaults.headers['Content-Type'] = 'application/json'
    // 拦截器，给请求头加上token
    axios.interceptors.request.use(config => {
      config.headers.Authorization = window.sessionStorage.getItem('token')
      return config
    })
  }

  sendMsg (method, url, msg, cb) {
    axios({
      method: method,
      url: url,
      data: msg
    }).then(data => cb(data)).catch(err => cb(err.response))
  }
}
