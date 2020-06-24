/* eslint-disable */
const { MongoClient } = require('mongodb') // const MongoClient = require('mongodb').MongoClient;
const Config = require('./config')

module.exports = class MongoDB {
  connectDB () {
    const _that = this
    return new Promise(((resolve, reject) => {
      // 如果已经存在连接，则直接返回
      if (_that.db) {
        resolve()
      } else {
        console.log(_that.db)
        MongoClient.connect(Config.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
          if (err) throw err
          _that.db = client.db(Config.dbName)
          console.log('数据库连接成功')
          resolve()
        })
      }
    }))
  }

  /**
   * 模糊查询 用于菜单栏等搜索
   * @param collectionName  // 集合名
   * @param queryData // 查询条件
   * @returns {Promise<unknown>}
   */
  likeFind (collectionName, queryData) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).find(queryData).toArray((err, result) => {
          if (err) throw err
          resolve(result)
        })
      })
    })
  }

  // 通用查询
  find (collectionName, queryData) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).find(queryData).toArray((err, result) => {
          if (err) throw err
          resolve(result)
        })
      })
    })
  }

  insertOneData (collectionName, queryData) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).insertOne(queryData, err => {
          if (err) throw err
          resolve()
        })
      })
    })
  }

  /**
   * 用于websocket服务保存聊天记录
   * @param collectionName
   * @param queryData
   */
  insertChatRecord (collectionName, queryData) {
    const _that = this
    this.connectDB().then(() => {
      _that.db.collection('chatRecord').updateOne(queryData.myQuery, { $push: { chat: queryData.myChat } })
      _that.db.collection('chatRecord').updateOne(queryData.youQuery, { $push: { chat: queryData.youChat } })
    })
  }

  /**
   * 用于websocket服务清理未读消息
   * @param collectionName
   * @param queryData
   */
  clearUnReadMsg (collectionName, queryData) {
    console.log(queryData.chat)
    const _that = this
    try {
      this.connectDB().then(() => {
        _that.db.collection('chatRecord').updateOne(queryData.Query, { $set: { 'chat': queryData.chat } })
      })
    } catch (e) {
      console.error(e)
    }
  }
}
