const Koa = require('koa')
const router = require('@koa/router')()
const koaBody = require('koa-body')
const cors = require('koa2-cors')
const app = new Koa()
const MongoDB = require('./mongodb.js')
const db = new MongoDB()
const jwt = require('jsonwebtoken')
app.listen(3000, console.log('server running at http://localhost:3000'))

app
  .use(koaBody())
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods()) // allowedMethods，官方文档推荐，自动根据ctx.status设置响应头

/* eslint-disable */
router.post('/api/login', async (ctx, next) => {
  ctx.set('Content-Type', 'application/json')
  let token = ''
  const data = ctx.request.body
  const queryData = {}
  queryData['UID'] = data.uid
  if (data.type === 'pwd') {
    queryData['UPASS'] = data.pwd // 当验证密码时，查询条件加上密码
    token = jwt.sign({ // 生成token
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: `${ctx.uid}pass`
    }, 'shhhhh')
  }
  let result = await db.find('user', queryData)  // 查询数据
  if (result.length > 0) {  // 当查询到匹配的数据则验证成功
    if (data.type === 'uid') {
      ctx.status = 200
      ctx.body = {
        msg: '验证成功',
        token: token,
        type: 'uid'
      }
    } else {
      ctx.body = {
        msg: '登录成功',
        token: token,
        type: 'pwd'
      }
    }
  } else {
    ctx.status = 401
    data.type === 'uid' ? ctx.body = '用户不存在' : ctx.body = '密码错误';
  }
})

/*
// 生成token
const token = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'pass'
}, 'shhhhh')
//  验证token
jwt.verify(token, 'shhhhh', function (err, decoded) {
  if (err) throw err
  // console.log(decoded.data)
})
*/
