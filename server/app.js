const Koa = require('koa')
const router = require('@koa/router')()
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const app = new Koa()
const MongoDB = require('./mongodb.js')
const db = new MongoDB()
const JsonWebToken = require('./jwt')
const jwt = new JsonWebToken()
const Config = require('./config')
require('./ws')(Config.wsServerPort)
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

/* eslint-disable */
router.post('/api/login', async (ctx, next) => {
  ctx.status = 200
  const data = ctx.request.body
  const queryData = {}
  queryData['UID'] = data.uid
  data.type === 'pwd' ? queryData['UPASS'] = data.pwd : '' // 当验证密码时，查询条件加上密码
  let result = await db.find('user', queryData)  // 查询数据
  if (result.length > 0) {  // 当查询到匹配的数据则验证成功
    const token = data.type === 'pwd' ? jwt.getToken(ctx.uid) : ''
    const resultArr = [{
      msg: '验证成功',
      type: 'uid'
    }, {
      msg: '登录成功',
      token: token,
      type: 'pwd'
    }]
    ctx.body = data.type === 'uid' ? resultArr[0] : resultArr[1]
  } else {
    const resultArr = [{
      msg: '请输入有效的邮箱地址或账号',
      type: 'err'
    }, {
      msg: '密码错误，请重试或点击“忘记密码”以重置密码',
      type: 'err'
    }]
    ctx.body = data.type === 'uid' ? resultArr[0] : resultArr[1]
  }
})

router.get('/api/chatHistory', async (ctx, next) => {
  let queryData = {}
  queryData.userID = ctx.query.uid
  let result = await db.find('chatRecord', queryData)  // 查询数据
 let resultArr = []
  result.forEach((value) => {
    resultArr.push({
      chatObj: value.chatObj,
      chat: value.chat
    })
  })
  ctx.body = {
    uid: ctx.query.uid,
    type: 'chatHistory',
    resultArr: resultArr
  }
})

router.get('/api/contact', async (ctx, next) => {
  // token有效，执行查询好友列表
  let queryData = {}
  queryData.UID = ctx.query.uid
  let result = await db.find('friend', queryData)  // 查询数据
  let resultArr = []
  result.forEach((value) => {
    resultArr.push(value.Friend)
  })
  ctx.body = {
    uid: ctx.query.uid,
    chatObj: ctx.query.chatObj,
    type: 'contact',
    resultArr: resultArr
  }
})

router.get('/api/chatRecord', async (ctx, next) => {
  let queryData = {}
  queryData.userID = ctx.query.uid
  queryData.chatObj = ctx.query.chatObj
  let result = await db.find('chatRecord', queryData)  // 查询数据
  ctx.body = {
    uid: ctx.query.uid,
    type: 'chatRecord',
    result: result[0].chat
  }
})
