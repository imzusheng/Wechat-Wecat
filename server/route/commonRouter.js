const router = require('@koa/router')()
const MongoDB = require('../module/mongodb')
const db = new MongoDB()

/**
 * @api {Get} /wechatAPI/common/chatHistory 获取历史聊天记录
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 通用
 *
 * @apiParam (请求参数) {String} email 用户名
 * @apiParamExample 请求示例:
 * {
 *   "userID": "imzusheng@163.com"
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
router.get('/wechatAPI/common/chatHistory', async (ctx) => {
  try {
    /** 从聊天记录中查询数据 */
    const queryMatch = {
      $match: {
        userID: ctx.query.email
      }
    }

    const queryProject = {
      $project: {
        _id: 0
      }
    }
    /** 查询聊天记录 */
    const chatRecordResult = await db.find('chatRecord', [queryMatch, queryProject])
    const queryParams = {
      $match: {
        $or: []
      }
    }
    const friendList = {}
    chatRecordResult.forEach(value => {
      friendList[value.chatObj] = value
      queryParams.$match.$or.push({
        email: value.chatObj
      })
    })
    /** 查询对应的用户信息 */
    const userInfoResult = await db.find('user', [queryParams, queryProject])
    userInfoResult.forEach((value, key) => {
      friendList[value.email].friendInfo = value
    })
    ctx.body = {
      data: friendList,
      error: false,
      msg: '获取聊天记录成功'
    }
  } catch (e) {
    ctx.body = {
      error: true,
      msg: '获取聊天记录失败'
    }
  }
})

router.get('/api/contact', async (ctx) => {
  let
    likeFindResult = []
  const resultArr = []
  const friendResult = await db.find('friend', {
    UID: ctx.query.uid
  })

  if (friendResult.length > 0) {
    /** 查询对应的用户信息 */
    const queryData = {}
    queryData.$or = []
    friendResult.forEach(value => queryData.$or.push({ email: value.Friend }))
    likeFindResult = await db.likeFind('user', queryData)
    /** 合并后发送 */
    likeFindResult.forEach((value) => {
      resultArr.push({
        email: value.email,
        avatar: value.avatar
      })
    })
  }

  ctx.body = {
    uid: ctx.query.uid,
    chatObj: ctx.query.chatObj,
    type: 'contact',
    resultArr: resultArr
  }
})

router.get('/api/friendApply', async (ctx) => {
  const friendResult = await db.find('friendApply', {
    'to.email': ctx.query.uid,
    status: false
  })
  ctx.body = {
    friendList: friendResult,
    type: 'friendApply'
  }
})

router.get('/api/chatRecord', async (ctx) => {
  const queryData = {}
  queryData.userID = ctx.query.uid
  queryData.chatObj = ctx.query.chatObj
  const result = await db.find('chatRecord', queryData) // 查询数据
  ctx.body = {
    uid: ctx.query.uid,
    type: 'chatRecord',
    result: result ? result[0].chat : []
  }
})

module.exports = router.routes()
