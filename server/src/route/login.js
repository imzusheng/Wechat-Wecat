const router = require('@koa/router')()
const MongoDB = require('../../src/module/mongodb')
const db = new MongoDB()
const JsonWebToken = require('../../src/module/jwt')
const jwt = new JsonWebToken()
const commonFunction = require('../../src/module/commonFunction')
const moment = require('moment')
const request = require('request')
const querystring = require('querystring')

function getCity (IPAddress) {
  return new Promise((resolve, reject) => {
    const queryData = querystring.stringify({
      ip: IPAddress,
      key: '3fc70466cf3f14c1908d58252f8c9f3c' // 申请的接口请求key
    })
    const queryUrl = 'http://apis.juhe.cn/ip/ipNew?' + queryData
    request(queryUrl, (error, response, body) => {
      if (error) return reject(error)
      resolve(JSON.parse(body))
    })
  })
}

/**
 * @api {Post} /wechatAPI/login/userID 验证用户名
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParam (请求参数) {String} nickName 昵称
 * @apiParamExample 请求示例:
 * {
 *   "userID": "imzusheng@163.com",
 *   "nickName": "zusheng"
 * }
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 信息
 * @apiSuccess (成功响应参数) {String} data.email 用户名
 * @apiSuccess (成功响应参数) {String} data.nickName 昵称
 * @apiSuccess (成功响应参数) {String} data.avatar 头像
 * @apiSuccessExample 成功响应示例:
 * {
 *   "msg": "success",
 *   "error": false,
 *   "data": {
 *       "email": "imzusheng@163.com",
 *       "nickName": "zusheng",
 *       "avatar": "",
 *   }
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String}msg 错误信息
 * @apiErrorExample 失败响应示例:
 * {
 *   "msg": "请输入有效的邮箱地址或账号"
 *   "error": true,
 *   "data": {}
 * }
 *
 */
router.post('/wechatAPI/login/userID', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  const queryParams = {
    $or: [
      { email: data.email }, { nickName: data.nickName }
    ]
  }
  const result = await db.query('user', queryParams) // 查询数据
  let res
  if (result.length > 0) {
    res = {
      msg: 'success',
      error: false,
      data: {
        email: result[0].email,
        nickName: result[0].nickName,
        avatar: result[0].avatar
      }
    }
  } else {
    res = {
      msg: '请输入有效的邮箱地址或账号',
      error: true,
      data: {}
    }
  }
  ctx.body = res
})
/**
 * @api {Post} /wechatAPI/login/pwd 验证密码
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParam (请求参数) {String} pwd 密码
 * @apiParamExample Request-Sample:
 * {
 *   "email": "imzusheng@163.com",
 *   "pwd": "123456"
 * }
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 信息
 * @apiSuccess (成功响应参数) {String} token 令牌
 * @apiSuccess (成功响应参数) {String} data.email 用户名
 * @apiSuccess (成功响应参数) {String} data.nickName 昵称
 * @apiSuccess (成功响应参数) {String} data.trueName 真实姓名
 * @apiSuccess (成功响应参数) {String} data.avatar 头像
 * @apiSuccess (成功响应参数) {String} data.access 权限
 * @apiSuccessExample Success-Response:
 * {
 *   "error": false,
 *   "msg": "success",
 *   "token": "......"
 *   "data": {
 *       "email": "imzusheng@163.com",
 *       "nickName": "zusheng",
 *       "trueName": "zusheng",
 *       "avatar": "",
 *       "access": "user"
 *   }
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String}msg 错误信息
 * @apiErrorExample Error-Response:
 * {
 *   "msg": "密码错误，请重试或点击“忘记密码”以重置密码"
 *   "error": true,
 *   "data": {}
 * }
 *
 */
router.post('/wechatAPI/login/pwd', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  const queryParams = {
    email: data.email,
    pwd: data.pwd
  }
  const result = await db.query('user', queryParams) // 查询数据
  let res
  if (result.length > 0) {
    const token = jwt.getToken(ctx.email) // 当密码验证成功时，返回token给客户端
    res = {
      msg: `登录成功，${result[0].email}`,
      error: false,
      token: token,
      data: {
        email: result[0].email,
        nickName: result[0].nickName,
        trueName: result[0].trueName,
        access: result[0].access,
        avatar: result[0].avatar
      }
    }
  } else {
    res = {
      msg: '密码错误，请重试或点击“忘记密码”以重置密码',
      error: true,
      data: {}
    }
  }
  ctx.body = res
})
/**
 * @api {Get} /wechatAPI/login/checkRepeatLogin 验证是否重复登录
 * @apiName 3
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParamExample Request-Sample:
 * {
 *   "email": "imzusheng@163.com"
 * }
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 信息
 * @apiSuccess (成功响应参数) {String} data.email 用户名
 * @apiSuccessExample Success-Response:
 * {
 *   "msg": "",
 *   "error": false
 *   "data": {
 *       "email": "imzusheng@163.com"
 *   }
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String} msg 错误信息
 * @apiError (失败响应参数) {String} data.email 用户名
 * @apiErrorExample Error-Response:
 * {
 *   "msg": "请勿重复登录"
 *   "error": true,
 *   "data": {
 *       "email": "imzusheng@163.com"
 *   }
 * }
 *
 */
router.get('/wechatAPI/login/checkRepeatLogin', (ctx) => {
  ctx.status = 200
  const data = ctx.query
  let flag = false
  require('../../src/module/ws').getOnlineClients().forEach(value => {
    if (value.userID === data.email) flag = true
  })
  ctx.body = {
    error: flag,
    msg: flag ? '请勿重复登录' : '',
    data: {
      clients: require('../../src/module/ws').getOnlineClients(),
      email: data.email
    }
  }
})
/**
 * @api {Put} /wechatAPI/login/update 登录后更新用户信息
 * @apiName 4
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParam (请求参数) {String} time 登录时间
 * @apiParam (请求参数) {String} address.Country
 * @apiParam (请求参数) {String} address.Province
 * @apiParam (请求参数) {String} address.City
 * @apiParam (请求参数) {String} address.Isp
 * @apiParamExample Request-Sample:
 * {
 *   "email": "imzusheng@163.com",
 *   "time": "",
 *   "address": {
 *      Country: '中国',
 *      Province: '广东省',
 *      City: '广州',
 *      Isp: '移动'
 *   }
 * }
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 信息
 * @apiSuccessExample Success-Response:
 * {
 *   "msg": "更新成功",
 *   "error": false
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String} msg 错误信息
 * @apiErrorExample Error-Response:
 * {
 *   "msg": "更新失败",
 *   "error": true
 * }
 *
 */
router.put('/wechatAPI/login/update', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  // 更新时间
  const newData = {
    $set: {
      RecentlyTime: data.time,
      address: data.address
    }
  }
  if (!data.address) delete newData.$set.address
  const result = await db.updateOne('user', { email: data.email }, newData)
  ctx.body = {
    error: !result,
    msg: result ? '更新成功' : '更新失败'
  }
})
/**
 * @api {Post} /wechatAPI/sign/verify 注册前验证
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 注册
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParam (请求参数) {String} nickName 昵称
 * @apiParamExample 请求示例:
 * {
 *   "email": "imzusheng@163.com",
 *   "nickName": ""
 * }
 *
 * @apiSuccess (成功响应参数) {Number} data.code 验证码
 * @apiSuccess (成功响应参数) {Number} data.msg 错误信息
 * @apiSuccess (成功响应参数) {String} data.email.value 邮箱
 * @apiSuccess (成功响应参数) {Boolean} data.email.error 错误
 * @apiSuccess (成功响应参数) {String} data.email.msg 错误信息
 * @apiSuccess (成功响应参数) {String} data.nickName.value 昵称
 * @apiSuccess (成功响应参数) {Boolean} data.nickName.error 错误
 * @apiSuccess (成功响应参数) {String} data.nickName.msg 错误信息
 * @apiSuccessExample 成功响应示例:
 * {
 *   data: {
 *      email: {
 *        "value": "imzusheng@163.com",
 *        "error": false,
 *        "msg": "success"
 *      },
 *      nickName: {
 *        "value": 'test',
 *        "error": false,
 *        "msg": "success"
 *      },
 *      msg: "验证码发送成功"
 *      code: 123456
 *   }
 * }
 *
 * @apiError (失败响应参数) {Number} data.code 验证码
 * @apiError (失败响应参数) {Number} data.msg 错误信息
 * @apiError (失败响应参数) {String} data.email.value 邮箱
 * @apiError (失败响应参数) {Boolean} data.email.error 错误
 * @apiError (失败响应参数) {String} data.email.msg 错误信息
 * @apiError (失败响应参数) {String} data.nickName.value 昵称
 * @apiError (失败响应参数) {Boolean} data.nickName.error 错误
 * @apiError (失败响应参数) {String} data.nickName.msg 错误信息
 * @apiErrorExample 失败响应示例:
 * {
 *   data: {
 *      email: {
 *        "value": 'imzusheng@163.com',
 *        "error": true,
 *        "msg": '该邮箱已被注册'
 *      },
 *      nickName: {
 *        "value": '',
 *        "error": true,
 *        "msg": '该昵称已被注册'
 *      },
 *      "msg": "验证码发送失败"
 *      code: 123445
 *   }
 * }
 *
 */
router.post('/wechatAPI/sign/verify', async (ctx) => {
  ctx.status = 200
  let flag = false// 用户是否符合注册条件
  const data = ctx.request.body
  const code = moment(new Date()).format('ssHHmm')
  const emailResult = await db.query('user', { email: data.email }) // 查询数据
  const nickNameResult = await db.query('user', { nickName: data.nickName }) // 查询数据
  if (emailResult.length === 0 && nickNameResult.length === 0) { // 用户符合注册条件时，发送邮箱验证码
    flag = await commonFunction.sendEmail({
      obj: data.email,
      code: code
    })
  }
  ctx.body = {
    data: {
      email: {
        value: data.email,
        error: emailResult.length !== 0,
        msg: emailResult.length === 0 ? 'success' : '该邮箱已被注册'
      },
      nickName: {
        value: data.nickName,
        error: nickNameResult.length !== 0,
        msg: nickNameResult.length === 0 ? 'success' : '该昵称已被注册'
      },
      code: flag ? code : '',
      msg: flag ? '验证码发送成功' : '验证码发送失败'
    }
  }
})
/**
 * @api {Post} /wechatAPI/sign/success 注册成功
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup 注册
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParam (请求参数) {String} nickName 昵称
 * @apiParam (请求参数) {String} trueName 真实名字
 * @apiParam (请求参数) {String} pwd 密码
 * @apiParam (请求参数) {String} avatar 头像链接
 * @apiParamExample 请求示例:
 * {
 *   "email": "imzusheng@163.com",
 *   "nickName": ""
 *   "trueName": ""
 *   "pwd": ""
 *   "avatar": ""
 * }
 *
 * @apiSuccess (成功响应参数) {String} msg 消息
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccessExample 成功响应示例:
 * {
 *   msg: "注册成功",
 *   error: false
 * }
 *
 * @apiError (失败响应参数) {String} msg 消息
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiErrorExample 失败响应示例:
 * {
 *   msg: "注册失败",
 *   error: true
 * }
 *
 *
 */
router.post('/wechatAPI/sign/success', async (ctx) => {
  ctx.status = 200
  const userInfo = ctx.request.body
  let flag = true
  Object.keys(userInfo).forEach(value => {
    if (!userInfo[value]) flag = false
  })

  if (flag) {
    const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    userInfo.access = 'user'
    userInfo.time = time
    // 用户信息写入
    await db.insertOneData('user', userInfo)
    const result = await db.query('user', userInfo) // 查询数据
    ctx.body = {
      msg: result.length !== 0 ? '注册成功' : '注册失败',
      error: result.length === 0
    }
  } else {
    ctx.body = {
      msg: '注册失败，你自己心里有数',
      error: true
    }
  }
})
/**
 * @api {Post} /wechatAPI/login/forget 忘记密码
 * @apiName 5
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParam (请求参数) {String} email 邮箱
 * @apiParamExample 请求示例:
 * {
 *   "email": "imzusheng@163.com"
 * }
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 消息
 * @apiSuccess (成功响应参数) {String} code 验证码
 * @apiSuccessExample 成功响应示例:
 * {
 *   code: 123456
 *   msg: "验证码发送成功",
 *   error: false
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String} msg 消息
 * @apiError (失败响应参数) {String} code 验证码
 * @apiErrorExample 失败响应示例:
 * {
 *   code: "",
 *   msg: "验证码发送失败" / "该邮箱地址不存在",
 *   error: true
 * }
 *
 *
 */
router.post('/wechatAPI/login/forget', async (ctx) => {
  ctx.status = 200
  let flag = false
  const data = ctx.request.body
  const code = moment(new Date()).format('ssHHmm')
  const result = await db.query('user', { email: data.email }) // 查询数据
  if (result.length !== 0) {
    flag = await commonFunction.sendEmail({
      obj: data.email,
      code: code
    })
    ctx.body = {
      error: flag,
      code: code,
      msg: flag ? '验证码发送成功' : '验证码发送失败'
    }
  } else {
    ctx.body = {
      code: '',
      error: true,
      msg: '该邮箱地址不存在'
    }
  }
})
/**
 * @api {Put} /wechatAPI/login/modifyPwd 修改密码
 * @apiName 6
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParam (请求参数) {String} email 邮箱
 * @apiParam (请求参数) {String} pwd 邮箱
 * @apiParamExample 请求示例:
 * {
 *   "email": "imzusheng@163.com",
 *   "pwd": "123456"
 * }
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 消息
 * @apiSuccessExample 成功响应示例:
 * {
 *   msg: "修改密码成功",
 *   error: false
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String} msg 消息
 * @apiErrorExample 失败响应示例:
 * {
 *   msg: "修改密码失败",
 *   error: true
 * }
 *
 *
 */
router.put('/wechatAPI/login/modifyPwd', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  // 先验证新旧密码是否相同
  const verifyPwd = await db.query('user', { email: data.email })
  if (verifyPwd[0].pwd === data.pwd) {
    ctx.body = {
      msg: '请勿与旧密码相同',
      error: true
    }
  } else {
    // 不相同则开始修改
    db.changePwd('user', [{ email: data.email }, { $set: { pwd: data.pwd } }])
    const result = await db.query('user', { email: data.email })
    // 验证是否修改成功
    if (result[0].pwd === data.pwd) {
      ctx.body = {
        msg: '修改密码成功',
        error: false
      }
    } else {
      ctx.body = {
        msg: '修改密码失败',
        error: true
      }
    }
  }
})
/**
 * @api {Get} /wechatAPI/login/userOrigin 获取用户真实IP
 * @apiName 7
 * @apiVersion 1.0.0
 * @apiGroup 登录
 *
 * @apiParamExample 请求示例:
 * {}
 *
 * @apiSuccess (成功响应参数) {Boolean} error 错误
 * @apiSuccess (成功响应参数) {String} msg 消息
 * @apiSuccess (成功响应参数) {String} data.IPAddress IP地址
 * @apiSuccess (成功响应参数) {String} data.result.Country 国家
 * @apiSuccess (成功响应参数) {String} data.result.Province 省份
 * @apiSuccess (成功响应参数) {String} data.result.City 城市
 * @apiSuccess (成功响应参数) {String} data.result.Isp 运营商
 *
 * @apiSuccessExample 成功响应示例:
 * {
 *   msg: "获取成功",
 *   error: false,
 *   data: {
 *     "IPAddress": "192.168.1.1",
 *     "result": {
 *        Country: '中国',
 *        Province: '广东省',
 *        City: '广州',
 *        Isp: '移动'
 *     }
 *   }
 * }
 *
 * @apiError (失败响应参数) {Boolean} error 错误
 * @apiError (失败响应参数) {String} msg 消息
 * @apiError (失败响应参数) {String} data.IPAddress IP地址
 * @apiErrorExample 失败响应示例:
 * {
 *   msg: "获取失败",
 *   error: true,
 *   data: {}
 * }
 *
 *
 */
router.get('/wechatAPI/login/userOrigin', async (ctx) => {
  ctx.status = 200
  let msg
  if (ctx.request.header.origin || ctx.request.header['x-real-ip']) {
    // const IPAddress = ctx.request.header.origin.slice(ctx.request.header.origin.indexOf('://') + 3, ctx.request.header.origin.lastIndexOf(':'))
    const result = await getCity(ctx.request.header['x-real-ip'])
    console.log(result)
    msg = {
      data: {
        IPAddress: ctx.request.header['x-real-ip'],
        result: result.result
      },
      error: false,
      msg: '获取成功'
    }
  } else {
    ctx.body = {
      data: {
        IPAddress: '',
        result: ''
      },
      error: true,
      msg: '获取失败'
    }
  }
  ctx.body = msg
})

module.exports = router.routes()
