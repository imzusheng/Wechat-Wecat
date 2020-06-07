/* eslint-disable */
const { MongoClient } = require('mongodb') // const MongoClient = require('mongodb').MongoClient;
const Config = require('./config')

module.exports = class MongoDB {
  connectDB () {
    const _that = this;
    return new Promise(((resolve, reject) => {
      if(_that.db){
        resolve()
        return
      }
      MongoClient.connect(Config.mongoUrl, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err
        _that.db = client.db(Config.dbName)
        console.log('数据库连接成功')
        resolve()
      })
    }))
  }

  find (collectionName, queryData) {
    const _that = this;
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).find(queryData).toArray((err, result) => {
          if (err) throw err
          resolve(result)
        })
      })
    })
  }

  update () {

  }

  insert () {

  }
}
