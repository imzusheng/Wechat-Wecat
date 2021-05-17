module.exports = {
  publicPath: '/chatV2/',
  devServer: {
    proxy: {
      '/wechatAPI': {
        target: 'http://localhost:3800', // 后台接口域名
        ws: true, // 代理 websocket
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/wechatAPI': ''
        }
      }
    }
  }
}
