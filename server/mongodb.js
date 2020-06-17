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

  insert (collectionName, queryData) {
    const _that = this
    this.connectDB().then(() => {
      _that.db.collection('chatRecord').updateOne(queryData.myQuery, { $push: { chat: queryData.myChat } })
      _that.db.collection('chatRecord').updateOne(queryData.youQuery, { $push: { chat: queryData.youChat } })
    })
  }

  update (collectionName, queryData) {
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
