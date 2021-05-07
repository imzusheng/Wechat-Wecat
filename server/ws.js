const WebSocket = require('ws')
const MongoDB = require('./mongodb.js')
const db = new MongoDB()

module.exports = (port) => {
  const wss = new WebSocket.Server({
    port: port
  })
  console.log(`WebSocketServer listen at ws://localhost:${port}`)
  // wss.clients为 set集合，转换为数组便于操作
  let clientsArr = []
  wss.on('connection', async (ws) => {
    ws.on('close', () => {
      // 有客户端离线时，更新在线客户端
      clientsArr = Array.from(wss.clients)
    })
    ws.on('message', (msg) => {
      clientsArr = Array.from(wss.clients)
      console.log('ws.js > ws.on ---- 在线人数：' + clientsArr.length)
      // const _that = this
      const MsgObj = JSON.parse(msg)
      const route = {
        chat,
        online,
        clearUnReadMsg,
        navSearch,
        addFriend,
        addFriendReply
      }
      const routeArr = ['chat', 'online', 'clearUnReadMsg', 'navSearch', 'addFriend', 'addFriendReply']
      if (routeArr.includes(MsgObj.type)) return route[MsgObj.type](MsgObj, wss, ws)
    })
  })
}

/**
 * 用户模糊搜索功能
 * @param MsgObj
 * @param wss
 * @param _that
 * @returns {Promise<void>}
 */
async function navSearch (MsgObj, wss, _that) {
  const Query = {}
  const q1 = {}
  const q2 = {}
  // 模糊查询条件
  q1.nickName = { $regex: new RegExp(MsgObj.msg) }
  q2.email = { $regex: new RegExp(MsgObj.msg) }
  Query.$or = [q1, q2]
  const result = await db.likeFind('user', Query)
  const resultArr = []
  result.forEach(value => {
    if (MsgObj.uid !== value.email) {
      resultArr.push({
        nickName: value.nickName,
        email: value.email,
        avatar: value.avatar
      })
    }
  })
  _that.send(JSON.stringify({
    uid: MsgObj.uid,
    resultArr: resultArr,
    type: 'navSearch'
  }))
}

/**
 * 清除未读消息
 * @param MsgObj
 * @param wss
 * @param _that
 * @returns {Promise<void>}
 */
async function clearUnReadMsg (MsgObj, wss, _that) {
  const Query = {}
  Query.userID = MsgObj.uid
  Query.chatObj = MsgObj.chatObj
  const result = await db.find('chatRecord', Query)
  const chat = result[0].chat
  chat.forEach(value => {
    if (value) value.status = true
  })
  db.clearUnReadMsg('chatRecord', {
    Query,
    chat
  })
}

/**
 * 上线
 * 将 userID 写入到客户端对象中，并判断是否有重复的客户端
 */
function online (MsgObj, wss, _that) {
  let userIDStatus = true
  wss.clients.forEach((client) => {
    if (client.userID === MsgObj.uid) {
      userIDStatus = false
    }
  })
  if (userIDStatus) {
    _that.userID = MsgObj.uid
  }
}

/**
 *   向数据库写入双方聊天记录
 *   对方在线保存聊天记录到聊天记录表
 *   不可靠插入！ 不需要等待返回结果
 */
async function chat (MsgObj, wss, _that, type) {
  if (type === 'agree') { // 同意好友申请后，假装成系统发送一条消息给双方
    let sendStatus1 = false
    let sendStatus2 = false
    wss.clients.forEach((client) => {
      if (client.userID === MsgObj.uid1) {
        client.send(JSON.stringify(MsgObj))
        sendStatus1 = true
      }
      if (client.userID === MsgObj.uid2) {
        client.send(JSON.stringify(MsgObj))
        sendStatus2 = true
      }
    })
    const myQuery = {
      userID: MsgObj.uid1,
      chatObj: MsgObj.uid2
    }
    const youQuery = {
      userID: MsgObj.uid2,
      chatObj: MsgObj.uid1
    }
    const myChat = {
      time: MsgObj.time,
      say: 'you',
      msg: MsgObj.msg,
      status: sendStatus1
    }
    const youChat = {
      time: MsgObj.time,
      say: 'you',
      msg: MsgObj.msg,
      status: sendStatus2
    }
    db.insertChatRecord('chatRecord', {
      myQuery,
      myChat,
      youQuery,
      youChat
    }, 'chat')
  } else {
    /**
     * 当聊天记录不存在的时候，要创建一个新的聊天记录，睡醒觉再说
     * @type {boolean}
     */
    let sendStatus = false // 消息是否发出，如果未发出则保存到未读消息表
    wss.clients.forEach((client) => {
      if (client.userID === MsgObj.chatObj) {
        client.send(JSON.stringify(MsgObj))
        console.log(`ws.js > chat() ---- 成功发送 ${MsgObj.uid} 消息到 ${client.userID}，消息内容：${MsgObj.msg}`)
        sendStatus = true
      }
    })
    const myQuery = {}
    const youQuery = {}
    myQuery.userID = MsgObj.uid
    myQuery.chatObj = MsgObj.chatObj
    youQuery.userID = MsgObj.chatObj
    youQuery.chatObj = MsgObj.uid
    const myChat = {
      time: MsgObj.time,
      say: 'me',
      msg: MsgObj.msg,
      status: true
    }
    const youChat = {
      time: MsgObj.time,
      say: 'you',
      msg: MsgObj.msg,
      status: sendStatus
    }
    db.insertChatRecord('chatRecord', {
      myQuery,
      myChat,
      youQuery,
      youChat
    }, 'chat')
  }
}

/**
 * 添加好友申请
 * @param MsgObj
 * @param wss
 * @param _that
 * @returns {Promise<void>}
 */
async function addFriend (MsgObj, wss, _that) {
  let sendStatus = false // 消息是否发出，如果未发出则保存到未读消息表
  wss.clients.forEach((client) => {
    if (client.userID === MsgObj.to.nickName) {
      client.send(JSON.stringify(MsgObj))
      sendStatus = true
    }
  })
  if (!sendStatus) { // 对方不在线时，请求保存到数据库
    const result = await db.find('friend', { // 查询是否已经发送过请求
      UID: MsgObj.from.email,
      Friend: MsgObj.to.email
    })
    if (!result.length) {
      const queryData = [{
        UID: MsgObj.from.email,
        Friend: MsgObj.to.email,
        status: MsgObj.status,
        applyMsg: MsgObj.applyMsg,
        num: 1
      }, {
        UID: MsgObj.to.email,
        Friend: MsgObj.from.email,
        status: MsgObj.status,
        applyMsg: MsgObj.applyMsg,
        num: 1
      }]
      await db.insertManyData('friend', queryData)
      _that.send(JSON.stringify({
        Msg: '已发送请求',
        type: 'addFriend',
        error: false
      }))
    } else {
      _that.send(JSON.stringify({
        Msg: '请勿重复添加',
        type: 'addFriend',
        error: true
      }))
    }
  }
}

/**
 * 同意或拒绝好友申请
 * @param MsgObj
 * @param wss
 * @param _that
 * @returns {Promise<void>}
 */
async function addFriendReply (MsgObj, wss, _that) {
  if (MsgObj.status) {
    await db.myUpdateOne('friend', {
      UID: MsgObj.uid,
      Friend: MsgObj.friend
    }, true, 1)
    await db.myUpdateOne('friend', {
      UID: MsgObj.friend,
      Friend: MsgObj.uid
    }, true, 1)
    const date = new Date()
    const formatTime = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    const agreeMsg = {
      msg: '已通过好友申请',
      time: formatTime,
      uid1: MsgObj.uid,
      uid2: MsgObj.friend,
      type: 'agree'
    }
    await this.chat(agreeMsg, wss, _that, 'agree') // 同意好友申请后，假装成系统发送一条消息给双方
  } else {
    const result = await db.find('friend', {
      UID: MsgObj.uid,
      Friend: MsgObj.friend
    })
    const num = Number(result[0].num) + 1
    await db.myUpdateOne('friend', {
      UID: MsgObj.uid,
      Friend: MsgObj.friend
    }, false, num)
    await db.myUpdateOne('friend', {
      UID: MsgObj.friend,
      Friend: MsgObj.uid
    }, false, num)
  }
}
