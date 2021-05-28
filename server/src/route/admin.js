const router = require('@koa/router')()
const MongoDB = require('../../src/module/mongodb')
const db = new MongoDB()

/**
 * 获取用户信息列表
 */
router.get('/wechatAPI/admin/userList', async (ctx) => {
  const result = await db.query('user', '') // 查询数据
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    result: result
  }
})

/**
 * 搜索用户
 */
router.get('/wechatAPI/admin/userListFind', async (ctx) => {
  const queryData = {}
  if (ctx.query.selectAccess !== 'all') queryData.access = ctx.query.selectAccess
  if (ctx.query.input) {
    queryData.$or = [
      {
        nickName: {
          $regex: new RegExp(ctx.query.input)
        }
      }, {
        email: {
          $regex: new RegExp(ctx.query.input)
        }
      }
    ]
  }
  const result = await db.query('user', queryData) // 查询数据
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    result: result
  }
})

/**
 * 修改用户信息
 */
router.post('/wechatAPI/admin/userListModify', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  await db.updateOne('user', { email: data.formData.email }, { $set: data.formData })
  ctx.body = {
    msg: 'success',
    type: 'userListModify'
  }
})

/**
 * 删除用户
 */
router.post('/wechatAPI/admin/userListDelete', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  await db.deleteOneData('user', {
    email: data.formData.email
  })
  ctx.body = {
    msg: 'success',
    type: 'userListDelete'
  }
})

/**
 * 聊天记录管理模块
 * 需要：所有用户名user、最近登录时间user、好友数量friend、好友总数friend、发送消息数量chatRecord、接受消息数量chatRecord
 * 不怕说，这段代码一周后回来自己看都看不懂，可别出了什么bug
 */
router.get('/wechatAPI/admin/chatRecordList', async (ctx) => {
  const userResult = await db.query('user', {})
  const friendResult = await db.query('friend', {})
  const chatRecord = await db.query('chatRecord', {})
  userResult.forEach(userValue => {
    userValue.friends = [] // 好友列表
    userValue.friendsCount = 0 // 好友总数
    userValue.RecentlyFriends = [] // 最近聊天的好友
    userValue.sendMsgCount = 0 // 发送消息总数
    userValue.recMsgCount = 0 // 接受消息总数

    friendResult.forEach(friValue => {
      /** 累加好友列表 */
      if (userValue.email === friValue.UID) {
        userValue.friends.push({
          name: friValue.Friend,
          sendMsgCount: 0,
          recMsgCount: 0
        })
        userValue.friendsCount += 1
      }
    })

    chatRecord.forEach(chatValue => {
      if (userValue.email === chatValue.userID) { // 属于我的聊天记录
        /** 累加有聊天记录的好友列表 */
        userValue.RecentlyFriends.push(chatValue.chatObj)
        /** 累加发送和接收消息的总数 */
        chatValue.chat.forEach(chatContent => {
          if (chatContent.say === 'me') {
            userValue.sendMsgCount++
            userValue.friends.forEach(friObj => friObj.name === chatValue.chatObj ? friObj.sendMsgCount++ : '')
          } else {
            userValue.recMsgCount++
            userValue.friends.forEach(friObj => friObj.name === chatValue.chatObj ? friObj.recMsgCount++ : '')
          }
        })
      }
    })
  })

  ctx.body = {
    msg: 'success',
    data: userResult,
    type: ctx.query.type
  }
})

/**
 * 聊天记录细节
 */
router.get('/wechatAPI/admin/chatDetail', async (ctx) => {
  const data = ctx.query
  const result = await db.query('chatRecord', {
    userID: data.uid,
    chatObj: data.chatObj
  })
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    result: {
      chat: result
    }
  }
})

/**
 * 聊天记录细节搜索
 */
router.get('/wechatAPI/admin/chatDetailFind', async (ctx) => {
  const data = typeof ctx.query.data === 'object' ? ctx.query.data : JSON.parse(ctx.query.data)
  const queryMatch = {
    $match: {
      userID: data.uid,
      chatObj: data.chatObj
    }
  }

  const queryProject = {
    $project: {
      chat: 1,
      _id: 0
    }
  }
  const queryUnwind = {
    $unwind: '$chat'
  }
  if (data.sendObj) {
    queryMatch.$match['chat.say'] = data.sendObj
  }
  if (data.keyword) {
    queryMatch.$match['chat.msg'] = { $regex: new RegExp(`.*${data.keyword}.*`) }
  }

  /*  if (data.startTime) {
    queryMatch.$match['chat.time'] = {
      $gte: data.startTime,
      $lte: data.endTime
    }
  } */
  /**
   * 查询内嵌数组并过滤：https://blog.csdn.net/u014756827/article/details/80677628
   * @type {({$unwind: string}|{$match: {'chat.msg': string, chatObj: string, userID: string}}|{$project: {chat: number}})[]}
   */
  const result = await db.detailFind('chatRecord', queryUnwind, queryMatch, queryProject)
  let newChat = []
  if (data.startTime) {
    result.forEach(value => {
      value.chat.time = value.chat.time.replace(/年|月/g, '-').replace(/日/g, '')
      if (new Date(value.chat.time).getTime() >= new Date(data.startTime).getTime() && new Date(value.chat.time).getTime() <= new Date(data.endTime).getTime()) {
        newChat.push(value)
      }
    })
  } else {
    newChat = result
  }
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    uid: data.uid,
    chatObj: data.chatObj,
    chatList: newChat
  }
})

module.exports = router.routes()
