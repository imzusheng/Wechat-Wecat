const WebSocket = require('ws')
const MongoDB = require('./mongodb.js')
const db = new MongoDB()
const moment = require('moment')

let clientsArr = []

module.exports = {
  getOnlineClients: function () {
    return clientsArr
  },
  link: function (port) {
    const wss = new WebSocket.Server({
      port: port
    })
    wss.on('connection', ws => { // 每当一个客户端新建连接时，激活connection，传入ws对象就是该客户端对象
      console.log(`WebSocketServer listen at ws://localhost:${port}`)
      ws.isAlive = true
      ws.on('pong', () => {
        ws.isAlive = true
      }) // 当收到客户端ping时, 立即回复pong。如果没收到pong则ws.isAlive=false，30秒后被关闭

      ws.on('message', (message) => { // 收到客户端消息时激活
        const msgObj = JSON.parse(message)
        /** wss.clients为 set集合，转换为数组便于操作 */
        clientsArr = Array.from(wss.clients)
        /** 对于type的不用，执行不同的操作 */
        const route = {
          chat,
          online,
          exit,
          clearUnReadMsg,
          addFriend,
          addFriendReply,
          inputStatus
        }
        const routeArr = []
        Object.keys(route).forEach(value => routeArr.push(value))
        if (routeArr.includes(msgObj.type)) return route[msgObj.type](msgObj, wss, ws)
      })
    })

    /** 设置定时器，定时ping服务器 */
    const isAliveInterval = setInterval(() => {
      wss.clients.forEach(client => {
        if (client.isAlive === false) return client.terminate() // 当该客户端已经断开连接则关闭该连接
        client.isAlive = false // 重置所有客户端存活状态为false
        client.ping() // ping客户端，马上就会收到客户端发回的pong，如果没则客户端断开连接
      })
    }, 15000) // 15秒检测一次客户端是否在线

    /** 连接关闭时激活，一般情况下不会关闭wss */
    wss.on('close', () => {
      console.log('wss->close')
      clearInterval(isAliveInterval)
    })
  }
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 客户端上线
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "type": "online"               // 类型
 * }
 */
function online (msgObj, wss, ws) {
  let userIDStatus = false
  wss.clients.forEach((client) => {
    if (client.userID === msgObj.from) {
      userIDStatus = true
    }
  })
  /** userIDStatus为false则用户没有重复在线 */
  if (!userIDStatus) {
    ws.userID = msgObj.from
    clientsArr = Array.from(wss.clients)
  }
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 客户端退出登录
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "type": "exit"               // 类型
 * }
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "msg": "退出登录",
 *   "type": "exit"
 * }
 *
 */
function exit (msgObj, wss, ws) {
  wss.clients.forEach((client, key) => {
    if (client.userID === msgObj.from) {
      client.userID = ''
      client.isAlive = false
      clientsArr.splice(key, 1) // 从在线客户端列表中删除客户端
      ws.send(JSON.stringify({
        error: false,
        msg: '退出登录',
        type: 'exit'
      }))
    }
  })
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 点对点聊天
 * @apiName 3
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "to": "test@163.com",        // 接收人
 *   "msg": {                     // 消息内容
 *      "content": "hello",
 *      "time": "2021-05-20 12:00:00"
 *   },
 *   "type": "chat"               // 类型
 * }
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "msg": "退出登录",
 *   "type": "exit"
 * }
 *
 */
async function chat (MsgObj, wss) {
  let unRead = true // 消息是否发出，如果未发出则保存到未读消息表
  wss.clients.forEach((client) => {
    if (client.userID === MsgObj.to) {
      client.send(JSON.stringify(MsgObj))
      unRead = false
    }
  })
  await db.updateOne('chatRecord',
    {
      $or: [
        {
          userID: { $regex: new RegExp(MsgObj.from) },
          chatObj: { $regex: new RegExp(MsgObj.to) }
        },
        {
          userID: { $regex: new RegExp(MsgObj.to) },
          chatObj: { $regex: new RegExp(MsgObj.from) }
        }
      ]
    }, {
      $inc: { count: +1 }
    }, {
      upsert: true
    })
  // const countResult = await db.query('chatRecord', {
  //   userID: MsgObj.from,
  //   chatObj: MsgObj.to
  // })
  // const count = countResult[0].count ? countResult[0].count : 1
  // 查询条件
  const myQuery = {
    userID: MsgObj.from,
    chatObj: MsgObj.to
  }
  const youQuery = {
    userID: MsgObj.to,
    chatObj: MsgObj.from
  }
  // 插入数据
  const myChat = {
    msg: MsgObj.msg.content,
    time: MsgObj.msg.time,
    say: 'me',
    msgID: MsgObj.msgID,
    postfix: MsgObj.postfix ? MsgObj.postfix : '',
    rawName: MsgObj.rawName ? MsgObj.rawName : '',
    type: MsgObj.file ? 'file' : 'chat',
    status: MsgObj.status
  }
  const youChat = {
    time: MsgObj.msg.time,
    msg: MsgObj.msg.content,
    say: 'you',
    msgID: MsgObj.msgID,
    postfix: MsgObj.postfix ? MsgObj.postfix : '',
    rawName: MsgObj.rawName ? MsgObj.rawName : '',
    type: MsgObj.file ? 'file' : 'chat',
    status: MsgObj.status
  }
  db.updateOne(
    'chatRecord',
    myQuery,
    {
      $push: { chat: myChat },
      $set: { currentChatDate: MsgObj.msg.time }
    },
    { upsert: true }).then()
  db.updateOne(
    'chatRecord',
    youQuery,
    {
      $push: { chat: youChat },
      $set: { currentChatDate: MsgObj.msg.time }
    },
    { upsert: true }).then()
  if (unRead) { // 当消息是未读状态的时候，更新未读消息条数
    db.updateOne('unReadMessage',
      {
        from: MsgObj.from,
        to: MsgObj.to
      }, {
        $inc: { count: +1 }
      }, {
        upsert: true
      }).then()
  }
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 清除未读标记
 * @apiName 4
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "to": "test@163.com",        // 接收人
 *   "type": "clearUnReadMsg"     // 类型
 * }
 */
async function clearUnReadMsg (msgObj) {
  db.updateOne('unReadMessage',
    {
      from: msgObj.from,
      to: msgObj.to
    }, {
      $set: { count: 0 }
    }, {
      upsert: true
    }).then()
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 添加好友
 * @apiName 5
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "to": "test@163.com",        // 接收人
 *   "status": false,
 *   "type": "addFriend"     // 类型
 * }
 *
 * @apiSuccessExample 成功示例：
 * {
 *   "error": false,
 *   "message": "请求已发送",
 *   "type": "addFriend"
 * }
 *
 * @apiErrorExample 错误示例：
 * {
 *   "error": true,
 *   "message": "请勿重复添加",
 *   "type": "addFriend"
 * }
 */
async function addFriend (msgObj, wss, ws) {
  const friApplyResult = await db.query('friendApply', {
    from: msgObj.from,
    to: msgObj.to
  })
  if (friApplyResult.length > 0) { // 重复发送请求，不理他
    ws.send(JSON.stringify({
      error: true,
      message: '请勿重复添加',
      type: 'addFriend'
    }))
  } else { // 进入发送请求的流程,type由friendApply变成handleApply
    msgObj.type = 'handleApply'
    const queryMatch = {
      $match: {
        email: msgObj.from
      }
    }
    const queryProject = {
      $project: {
        _id: 0,
        pwd: 0,
        access: 0
      }
    }
    // 查找用户信息
    const userResult = await db.aggregate('user', [queryMatch, queryProject])
    msgObj.fromInfo = userResult[0]
    let unRead = true // 消息是否发出，如果未发出则保存到未读消息表
    wss.clients.forEach((client) => {
      if (client.userID === msgObj.to) {
        client.send(JSON.stringify(msgObj))
        unRead = false
      }
    })
    if (unRead) { // 用户不在线时
      await db.insertOneData('friendApply', msgObj)
    }
    ws.send(JSON.stringify({
      error: false,
      message: '请求已发送',
      type: 'addFriend'
    }))
  }
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 处理好友请求
 * @apiName 6
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "to": "test@163.com",        // 接收人
 *   "status": true,            // 同意还是不同意
 *   "type": "addFriendReply"     // 类型
 * }
 *
 * @apiSuccessExample 成功示例：
 * {
 *   "from": "",
 *   "to": "",
 *   "error": true,
 *   "message": "好友请求已通过",
 *   "type": "addFriendReply",
 *   "time": ""
 * }
 *
 * @apiErrorExample 错误示例：
 * {
 *   "from": "",
 *   "to": "",
 *   "error": false,
 *   "message": "好友请求未通过",
 *   "type": "addFriendReply",
 *   "time": ""
 * }
 *
 */
async function addFriendReply (msgObj, wss) {
  let Msg
  const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
  /** 同意好友申请的操作 */
  console.log(msgObj)
  if (msgObj.status) {
    /** 不存在时则写入好友关系 */
    await db.insertManyData('friend', [
      {
        UID: msgObj.from,
        Friend: msgObj.to,
        time
      }, {
        UID: msgObj.to,
        Friend: msgObj.from,
        time
      }
    ])

    /** 数据库好友申请表状态改为status: true */
    db.updateOne('friendApply', {
      from: msgObj.from,
      to: msgObj.to
    }, {
      $set: {
        status: true
      }
    }, {}).then()

    /** 同意好友申请后，假装成系统发送一条消息给双方 */
    Msg = {
      from: msgObj.from,
      to: msgObj.to,
      error: false,
      message: '好友请求已通过',
      type: 'addFriendReply',
      time
    }

    /// ///////////////////////////////////////////////////////////////////////////////////// 当然别忘了插入两条聊天记录
    this.chat({
      msg: {
        time: time,
        content: '已通过好友申请 '
      },
      msgID: 0,
      from: msgObj.from,
      to: msgObj.to,
      type: 'chat',
      status: true
    }, wss)
  } else {
    /** 好友请求拒绝 */
    Msg = {
      from: msgObj.from,
      to: msgObj.to,
      error: true,
      message: '好友请求未通过',
      type: 'addFriendReply',
      time
    }
    // 删除好友请求表中的记录
    db.deleteOneData('friendApply', {
      from: msgObj.from,
      to: msgObj.to
    }).then()
  }
  wss.clients.forEach(client => {
    if (client.userID === msgObj.from || client.userID === msgObj.to) client.send(JSON.stringify(Msg))
  })
}

/**
 * @api {WebSocket} wss://zusheng.club/wsServer 聊天面板输入状态
 * @apiName 7
 * @apiVersion 1.0.0
 * @apiGroup WebSocket
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "from": "imzusheng@163.com", // 消息发送人
 *   "to": "test@163.com",        // 接收人
 *   "inputStatus": false,             // 输入状态
 *   "type": "inputStatus"        // 类型
 * }
 */
async function inputStatus (msgObj, wss) {
  wss.clients.forEach(client => {
    if (client.userID === msgObj.to) {
      client.send(JSON.stringify(msgObj))
    }
  })
}
