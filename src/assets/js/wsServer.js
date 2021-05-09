let msg = {}

export class WsServer {
  constructor (url, uid, cb) {
    this.Guid = uid
    this.Gcb = cb
    this.connect(url).then()
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
        this.Gws.onopen = () => {
          msg = JSON.stringify({
            uid: this.Guid,
            type: 'online'
          })
          this.Gws.send(msg)
          console.log('%cwss：连接成功!', 'color: red')
          resolve(this.Gws)
        }
      } else {
        resolve(this.Gws)
      }
    })
  }

  errorCb (err) {
    console.error('ws：连接意外断开', err)
    this.Gws = null
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
        // console.log('%cwsServer.js > ws.send(JSON.stringify(msg))', 'color: red', msg)
        ws.onmessage = data => {
          // console.log('%cwsServer.js >  ws.onmessage', 'color: red', JSON.parse(data.data))
          cb(data)
        }
      })
    } catch (e) {
      console.error(e)
    }
  }
}
