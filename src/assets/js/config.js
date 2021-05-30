export default {
  server: {
    httpServer: process.env.NODE_ENV === 'production' ? 'https://zusheng.club/wechatAPI' : 'http://localhost:3800/wechatAPI',
    httpPort: '80',
    wsServer: process.env.NODE_ENV === 'production' ? 'wss://zusheng.club/wsServerV2' : 'ws://localhost:4800',
    wsServerPort: '4800'
  },
  admin: {
    httpServerProtocol: 'http://',
    httpServer: 'localhost:3800/wechatAPI',
    httpPort: '3800',
    wsServerProtocol: 'ws://',
    wsServer: 'localhost:4800',
    wsServerPort: '4800'
  }
}
