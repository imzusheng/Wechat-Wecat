/* eslint-disable */
const { MongoClient } = require('mongodb') // const MongoClient = require('mongodb').MongoClient;
const Config = require('../config')

module.exports = class MongoDB {
  connectDB () {
    const _that = this
    return new Promise(((resolve, reject) => {
      // 如果已经存在连接，则直接返回
      if (_that.db) {
        resolve()
      } else {
        MongoClient.connect(Config.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
          if (err) throw err
          _that.db = client.db(Config.dbName)
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
  find (collectionName, queryParams) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).aggregate(queryParams).toArray((err, result) => {
          if (err) throw err
          resolve(result)
        })
      })
    })
  }

  // 通用查询
  query (collectionName, queryParams) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).find(queryParams).toArray((err, result) => {
          if (err) throw err
          resolve(result)
        })
      })
    })
  }

  detailFind (collectionName, queryUnwind, queryMatch, queryProject) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).aggregate([queryUnwind, queryMatch, queryProject]).toArray((err, result) => {
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

  insertManyData (collectionName, queryData) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).insertMany(queryData, err => {
          if (err) throw err
          resolve()
        })
      })
    })
  }

  deleteOneData (collectionName, queryData) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        console.log('执行删除', queryData)
        _that.db.collection(collectionName).deleteOne(queryData, err => {
          if (err) throw err
          resolve()
        })
      })
    })
  }

  myUpdateOne (collectionName, queryData, newData, num) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).updateOne(queryData, {
          $set: {
            status: newData,
            num: num
          }
        }, err => {
          if (err) throw err
          resolve()
        })
      })
    })
  }

  updateOne (collectionName, queryData, newData) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).updateOne(queryData, newData, (err, res) => {
          if (err) return reject(err)
          resolve(true)
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
    const _that = this
    try {
      this.connectDB().then(() => {
        _that.db.collection('chatRecord').updateOne(queryData.Query, { $set: { 'chat': queryData.chat } })
      })
    } catch (e) {
      console.error(e)
    }
  }

  changePwd (collectionName, queryParams) {
    const _that = this
    try {
      this.connectDB().then(() => {
        _that.db.collection('user').updateOne(queryParams[0], queryParams[1])
      })
    } catch (e) {
      console.error(e)
    }
  }
}
