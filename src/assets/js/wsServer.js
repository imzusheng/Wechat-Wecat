// import store from '../../store'

let msg = {}

export class WsServer {
  constructor (url, cb) {
    this.Gcb = cb
    this.connect(url).then(ws => {
      console.log('%cwss：连接成功!', 'color: red')
      msg = JSON.stringify({
        from: window.sessionStorage.getItem('uid'),
        type: 'online'
      })
      ws.send(msg)
    })
  }

  connect (url) {
    return new Promise((resolve) => {
      // 判断是否存在连接，不存在则新建
      if (!this.Gws) {
        console.log('%cwss：新建连接', 'color: red')
        this.Gws = new WebSocket(url)
        // 发生错误断开，10秒自动重连一次
        this.Gws.onerror = err => this.errorCb(err)
        this.Gws.onclose = err => this.errorCb(err)
        this.Gws.onmessage = data => this.Gcb(data)
        this.Gws.onopen = () => resolve(this.Gws)
      } else {
        resolve(this.Gws)
      }
    })
  }

  errorCb (err) {
    console.error('ws：连接意外断开')
    this.Gws = null
    this.wsTimer = setTimeout(() => {
      clearTimeout(this.wsTimer)
      this.connect(err.target.url).then(ws => {
        console.log('%cwss：连接成功!', 'color: red')
        msg = JSON.stringify({
          from: window.sessionStorage.getItem('uid'),
          type: 'online'
        })
        ws.send(msg)
      })
    }, 1000)
  }

  sendMsg (msg, cb) {
    try {
      this.connect().then(ws => {
        ws.send(JSON.stringify(msg))
        ws.onmessage = data => {
          cb(data)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}
