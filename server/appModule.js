const Koa = require('koa')
const router = require('./route/router')
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const app = new Koa()
const JsonWebToken = require('./jwt')
const jwt = new JsonWebToken()
const Config = require('./config')
require('./ws').link(Config.wsServerPort)
app.listen(Config.serverPort, console.log('server running at http://localhost:3000'))

app
  .use(koaBody())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods()) // allowedMethods，官方文档推荐，自动根据ctx.status设置响应头

/**
 * 验证token
 */
app.use(async (ctx, next) => {
  ctx.set('Content-Type', 'application/json')
  if (ctx.method !== 'GET') return next()
  const verify = await jwt.tokenVerify(ctx)
  ctx.status = verify
  if (verify === 204) {
    ctx.body = { msg: 'not expired 身份认证已过期' }
  } else {
    await next()
  }
})
