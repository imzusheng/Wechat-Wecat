const CompressionPlugin = require('compression-webpack-plugin')

// const cdn = {
//   js: [
//     'https://cdn.bootcdn.net/ajax/libs/moment.js/2.29.1/locale/zh-cn.min.js',
//     'https://cdn.bootcdn.net/ajax/libs/element-ui/2.15.1/index.min.js'
//   ]
// }

module.exports = {
  // 整个屁，cdn加载还没我服务器快
  // configureWebpack: config => {
  //   if (process.env.NODE_ENV === 'production') {
  //     config.externals = {
  //       moment: 'moment',
  //       'element-ui': 'ElementUI'
  //     }
  //   }
  // },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // config.plugin('html')
      //   .tap(args => {
      //     args[0].cdn = cdn
      //     return args
      //   })
      config.plugin('compressionPlugin').use(new CompressionPlugin({
        test: /\.(js|css)$/, // 匹配文件名
        threshold: 0, // 对超过10k的数据压缩
        minRatio: 0.8,
        deleteOriginalAssets: true // 删除源文件
      }))
    }
  },
  productionSourceMap: false,
  publicPath: '/chatV2/'

  // devServer: {
  //   proxy: {
  //     '/wechatAPI': {
  //       target: 'http://localhost:3800', // 后台接口域名
  //       ws: true, // 代理 websocket
  //       secure: false, // 如果是https接口，需要配置这个参数
  //       changeOrigin: true, // 是否跨域
  //       pathRewrite: {
  //         '^/wechatAPI': ''
  //       }
  //     }
  //   }
  // }
}
