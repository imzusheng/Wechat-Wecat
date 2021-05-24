export default {
  local: {
    httpServer: 'http://localhost:3800/wechatAPI',
    httpPort: '3800',
    wsServer: 'ws://localhost:4800',
    wsServerPort: '4800'
  },
  server: {
    httpServer: process.env.NODE_ENV === 'production' ? 'https://zusheng.club/wechatAPI' : 'http://localhost:3800/wechatAPI',
    httpPort: '80',
    wsServer: process.env.NODE_ENV === 'production' ? 'wss://zusheng.club/wsServerV2' : 'ws://localhost:4800',
    wsServerPort: '4800'
  }
}
