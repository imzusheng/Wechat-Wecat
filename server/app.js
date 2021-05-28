const koaBody = require('koa-body')
const cors = require('koa2-cors')
const Koa = require('koa')
const app = new Koa()
const router = require('./src/route/router')
const commonFunction = require('./src/module/commonFunction')
const Config = require('./config')
require('./src/module/ws').link(Config.wsServerPort) /// ///////////////////// ws服务器跑起来

app
  .use(koaBody(Config.koaOptions)) /// /////////////////////////////////// 接收文件配置
  .use(cors()) /// /////////////////////////////////////////////////////// 处理跨域
  .use((ctx, next) => commonFunction.verifyToken(ctx, next))
  .use(router.routes()) /// ////////////////////////////////////////////// 挂载路由
  .use(router.allowedMethods()) /// ////////////////////////////////////// allowedMethods，官方文档推荐，自动根据ctx.status设置响应头

app.listen(Config.serverPort, () => { /// //////////////////////////////// 服务器跑起来了，跟你说一声
  console.log(`ENV = ${process.env.NODE_ENV} and server running at http://localhost:${Config.serverPort}`)
})
