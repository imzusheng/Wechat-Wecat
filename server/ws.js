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
  wss.on('connection', async (ws, request) => {
    ws.on('close', () => {
      // 有客户端离线时，更新在线客户端
      clientsArr = Array.from(wss.clients)
    })
    ws.on('message', (msg) => {
      clientsArr = Array.from(wss.clients)
      console.log('在线人数：' + clientsArr.length)
      // const _that = this
      const MsgObj = JSON.parse(msg)
      const route = {
        chat,
        online,
        clearUnReadMsg,
        navSearch
      }
      const routeArr = ['chat', 'online', 'clearUnReadMsg', 'navSearch']
      if (routeArr.includes(MsgObj.type)) return route[MsgObj.type](MsgObj, wss, ws)
    })
  })
}

async function navSearch (MsgObj, wss, _that) {
  const Query = {}
  const reg = new RegExp(`${MsgObj.msg}`)
  Query.UID = {
    $regex: reg
  } // 模糊查询条件
  console.log(Query)
  const result = await db.likeFind('user', Query)
  const resultArr = []
  result.forEach(value => {
    resultArr.push(value.UID)
  })
  _that.send(JSON.stringify({
    uid: MsgObj.uid,
    resultArr: resultArr
  }))
}

async function clearUnReadMsg (MsgObj, wss, _that) {
  const Query = {}
  Query.userID = MsgObj.uid
  Query.chatObj = MsgObj.chatObj
  const result = await db.find('chatRecord', Query)
  const chat = result[0].chat
  chat.forEach(value => {
    if (value) value.status = true
  })
  db.update('chatRecord', {
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
async function chat (MsgObj, wss, _that) {
  let sendStatus = false // 消息是否发出，如果未发出则保存到未读消息表
  wss.clients.forEach((client) => {
    if (client.userID === MsgObj.chatObj) {
      client.send(JSON.stringify(MsgObj))
      console.log(`成功发送 ${MsgObj.uid} 消息到 ${client.userID}，消息内容：${MsgObj.msg}`)
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
  db.insert('chatRecord', {
    myQuery,
    myChat,
    youQuery,
    youChat
  }, 'chat')
}
