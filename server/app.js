const Koa = require('koa')
const router = require('@koa/router')()
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const app = new Koa()
const MongoDB = require('./mongodb.js')
const db = new MongoDB()
const JsonWebToken = require('./jwt')
const jwt = new JsonWebToken()
const sendEmail = require('./EmailServer')
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

/* eslint-disable */  // 不加这句话会给气死
router.post('/api/login', async (ctx, next) => {
  ctx.status = 200
  const data = ctx.request.body
  const queryData = {}
  queryData['email'] = data.uid
  data.type === 'pwd' ? queryData['pwd'] = data.pwd : '' // 当验证密码时，查询条件加上密码
  let result = await db.find('user', queryData)  // 查询数据
  if (result.length > 0) {  // 当查询到匹配的数据则验证成功
    const token = data.type === 'pwd' ? jwt.getToken(ctx.uid) : ''  // 当密码验证成功时，返回token给客户端
    const resultArr = [{
      msg: '验证成功',
      type: 'uid'
    }, {
      msg: '登录成功',
      token: token,
      nickName: result[0].nickName,
      email: result[0].email,
      avatar: result[0].avatar,
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

router.post('/api/signSuc', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  // 注册时间
  let date = new Date()
  let formatTime = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  // 用户信息写入
  const queryData = {}
  queryData.nickName = data.firstName
  queryData.trueName = data.lastName
  queryData.pwd = data.pwd
  queryData.email = data.email
  queryData.avatar = data.avatar
  queryData.access = 'user'
  queryData.time = formatTime
  await db.insertOneData('user', queryData)
  let result = await db.find('user', queryData)  // 查询数据
  if (result.length === 1) {
    ctx.body = {
      uid: data.uid,
      emial: data.email,
      type: 'success'
    }
  }
})

router.post('/api/forget', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  if (data.type === 'email') {
    const queryData = {}
    queryData.email = data.email
    let result = await db.find('user', queryData)  // 查询数据
    if (result.length > 0 && result[0].email === data.email) {  // 匹配到是已注册用户，则发送验证码
      let date = new Date()
      let code = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString()
      sendEmail({
        obj: data.email,
        code: code
      })
      ctx.body = {
        code: code,
        type: 'codeSuc'
      }
    } else {  // 数据库中不存在该用户
      ctx.body = {
        code: '',
        type: 'codeErr',
        msg: '不存在该用户，请重试'
      }
    }
  } else if (data.type === 'newPwd') {
    const queryData = {}
    queryData.email = { email: data.email }
    queryData.pwd = data.pwd
    db.changePwd('user', queryData)
    ctx.body = {
      type: 'newPwd'
    }
  }
})

router.post('/api/sign', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  if (data.type === 'Resend') { // 重新发送验证码
    sendEmail({
      obj: data.email,
      code: code
    })
    ctx.body = {
      code: code,
      type: 'code'
    }
    return
  }
  const queryData = {}
  queryData.email = data.email
  let result = await db.find('user', queryData)  // 查询数据
  if (result.length !== 0) { // 能查询到用户说明邮箱已经注册过了
    ctx.body = {
      uid: data.uid,
      email: data.email,
      msg: '邮箱已被注册',
      type: 'error',
      error: '0'  //假装是错误代码，邮箱已经被注册
    }
  } else {
    let date = new Date()
    let code = date.getHours().toString() + date.getMinutes().toString() + date.getSeconds().toString() //利用时间组合成验证码
    sendEmail({ //发送验证码
      obj: data.email,
      code: code
    })
    ctx.body = {
      uid: data.uid,
      code: code,
      type: 'code'
    }
  }
})

router.get('/api/chatHistory', async (ctx) => {
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

router.get('/api/contact', async (ctx) => {
  // token有效，执行查询好友列表
  let queryData = {}
  queryData.UID = ctx.query.uid
  let friendResult = await db.find('friend', queryData)  // 查询数据
  let onlineArr = [], apply = []
  friendResult.forEach(value => {
    value.status ? onlineArr.push(value.Friend) : apply.push(value.Friend) // status为true时为已经添加的好友，false是待通过状态
  })
  // 下面friendApply是未通过的好友申请列表，获取发起申请方的所有信息
  let arr = []  //检索的条件，
  apply.forEach(value => arr.push(value))
  queryData = {}
  queryData.email = { '$in': arr }  //一个字段多个条件的查询
  let friendApply = await db.find('user', queryData)
  let applyMsg = await db.find('friend', { UID: { '$in': arr } })
  friendApply.forEach((value, key) => value.applyMsg = applyMsg[key].applyMsg)  //把applyMsg插入到friendApply对象中
  ctx.body = {
    uid: ctx.query.uid,
    chatObj: ctx.query.chatObj,
    type: 'contact',
    resultArr: onlineArr,
    apply: JSON.stringify(friendApply)
  }
})

router.get('/api/chatRecord', async (ctx) => {
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