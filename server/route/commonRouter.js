const router = require('@koa/router')()
const MongoDB = require('../module/mongodb')
const db = new MongoDB()

router.get('/api/chatHistory', async (ctx) => {
  const resultArr = []
  let result = []
  const chat = []
  /** 从聊天记录中查询数据 */
  result = await db.find('chatRecord', {
    userID: ctx.query.uid
  })
  if (result.length > 0) {
    result.forEach(value => {
      chat.push({
        chatObj: value.chatObj,
        chat: value.chat
      })
    })
    /** 查询对应的用户信息 */
    const queryData = {}
    queryData.$or = []
    chat.forEach(value => queryData.$or.push({ email: value.chatObj }))
    result = await db.likeFind('user', queryData)
    /** 合并后发送 */
    result.forEach((value, key) => {
      resultArr.push({
        chatObj: chat[key].chatObj,
        chat: chat[key].chat,
        nickName: value.nickName,
        trueName: value.trueName,
        email: value.email,
        avatar: value.avatar,
        access: value.access,
        time: value.time
      })
    })
  }
  ctx.body = {
    uid: ctx.query.uid,
    type: 'chatHistory',
    resultArr: resultArr
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
