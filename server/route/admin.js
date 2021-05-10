const router = require('@koa/router')()
const MongoDB = require('../mongodb')
const db = new MongoDB()

/**
 * 获取用户信息列表
 */
router.get('/api/admin/userList', async (ctx) => {
  const result = await db.find('user', '') // 查询数据
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    result: result
  }
})

/**
 * 搜索用户
 */
router.get('/api/admin/userListFind', async (ctx) => {
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
  const result = await db.find('user', queryData) // 查询数据
  console.log(result)
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    result: result
  }
})

/**
 * 修改用户信息
 */
router.post('/api/admin/userListModify', async (ctx) => {
  ctx.status = 200
  const data = ctx.request.body
  console.log(data)
  await db.updateOne('user', { email: data.formData.email }, { $set: data.formData })
  ctx.body = {
    msg: 'success',
    type: 'userListModify'
  }
})

/**
 * 删除用户
 */
router.post('/api/admin/userListDelete', async (ctx) => {
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
router.get('/api/admin/chatRecordList', async (ctx) => {
  const userResult = await db.find('user', {})
  const friendResult = await db.find('friend', {})
  const chatRecord = await db.find('chatRecord', {})
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
router.get('/api/admin/chatDetail', async (ctx) => {
  const data = ctx.query
  const result = await db.find('chatRecord', {
    userID: data.uid,
    chatObj: data.chatObj
  })
  ctx.body = {
    msg: 'success',
    type: ctx.query.type,
    result: result
  }
})

module.exports = router.routes()
