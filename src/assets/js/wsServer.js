let Guid = ''
let Gcb = ''
let Gws = ''
export class WsServer {
  constructor (url, uid, cb) {
    Guid = uid
    Gcb = cb
    this.connect(url)
  }

  connect (url) {
    const msg = JSON.stringify({
      uid: Guid,
      type: 'online'
    })
    return new Promise((resolve, reject) => {
      // 判断是否存在连接，不存在则新建
      if (!Gws) {
        console.log('wss：新建连接')
        Gws = new WebSocket(url)
        // 发生错误断开，10秒自动重连一次
        Gws.onerror = err => this.errorCb(err)
        Gws.onclose = err => this.errorCb(err)
        Gws.onmessage = data => Gcb(data)
        Gws.onopen = () => {
          Gws.send(msg)
          console.log('wss：连接成功!')
          resolve(Gws)
        }
      } else {
        resolve(Gws)
      }
    })
  }

  errorCb (err) {
    console.error('ws：连接意外断开')
    Gws = null
    const _that = this
    this.wsTimer = setTimeout(() => {
      clearTimeout(_that.wsTimer)
      _that.connect(err.target.url)
    }, 1000)
  }

  sendMsg (msg, cb) {
    try {
      this.connect().then((ws) => {
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
