const router = require('@koa/router')()
const MongoDB = require('../module/mongodb')
const db = new MongoDB()

/**
 * @api {Get} /wechatAPI/common/chatHistory 获取历史聊天记录
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 通用
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
    const chatRecordResult = await db.aggregate('chatRecord', [queryMatch, queryProject])
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
    const userInfoResult = await db.aggregate('user', [queryParams, queryProject])
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
/**
 * @api {Get} /wechatAPI/common/navSearch 全局搜索用户
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup 通用
 *
 */
router.get('/wechatAPI/common/navSearch', async (ctx) => {
  const data = ctx.query
  if (!data.email) return
  const queryMatch = {
    $match: {
      $or: [
        { email: { $regex: new RegExp(data.email) } },
        { nickName: { $regex: new RegExp(data.nickName) } }
      ],
      email: { $nin: [data.userID] } // 搜索当然要不包括自己啦
    }
  }

  const queryProject = {
    $project: {
      _id: 0,
      pwd: 0,
      access: 0,
      time: 0,
      RecentlyTime: 0,
      address: 0
    }
  }
  const result = await db.aggregate('user', [queryMatch, queryProject])
  ctx.body = {
    error: false,
    msg: '查找成功',
    result
  }
})
/**
 * @api {Get} /wechatAPI/common/chat 发送消息
 * @apiName 3
 * @apiVersion 1.0.0
 * @apiGroup 通用
 *
 */
router.get('/wechatAPI/common/navSearch', async (ctx) => {
  const data = ctx.query
  const queryMatch = {
    $match: {
      $or: [
        { email: { $regex: new RegExp(data.email) } },
        { nickName: { $regex: new RegExp(data.nickName) } }
      ],
      email: { $nin: [data.userID] } // 搜索当然要不包括自己啦
    }
  }

  const queryProject = {
    $project: {
      _id: 0,
      pwd: 0,
      access: 0,
      time: 0,
      RecentlyTime: 0,
      address: 0
    }
  }
  const result = await db.aggregate('user', [queryMatch, queryProject])
  ctx.body = {
    error: false,
    msg: '查找成功',
    result
  }
})
/**
 * @api {Get} /wechatAPI/common/addFriend 发送消息
 * @apiName 4
 * @apiVersion 1.0.0
 * @apiGroup 通用
 *
 */
router.post('/wechatAPI/common/addFriend', async (ctx) => {
  const data = ctx.request.body
  let sendStatus = false // 消息是否发出，如果未发出则保存到未读消息表
  require('../module/ws').getOnlineClients().forEach(value => {
    if (value.userID === data.email) {
      sendStatus = true
    }
  })
  console.log(sendStatus)
  ctx.body = {
    error: false,
    msg: '查找成功'
  }
})
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
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
