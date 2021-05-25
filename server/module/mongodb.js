const { MongoClient } = require('mongodb') // const MongoClient = require('mongodb').MongoClient;
const Config = require('../config')

module.exports = class MongoDB {
  connectDB () {
    const _that = this
    return new Promise((resolve, reject) => {
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
    })
  }

  // 管道，高级查询
  aggregate (collectionName, queryParams, sort) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        if (sort) {
          _that.db.collection(collectionName).aggregate(queryParams).sort(sort).toArray((err, result) => {
            if (err) throw err
            resolve(result)
          })
        } else {
          _that.db.collection(collectionName).aggregate(queryParams).toArray((err, result) => {
            if (err) throw err
            resolve(result)
          })
        }
      }
      )
    })
  }

  // 通用查询 *************待修改
  find (collectionName, queryParams) {
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

  // admin页面中细节搜索 *************待修改
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

  deleteOneData (collectionName, queryParams) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).deleteOne(queryParams, err => {
          if (err) throw err
          resolve()
        })
      })
    })
  }

  deleteManyData (collectionName, queryParams) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).deleteMany(queryParams, err => {
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

  updateOne (collectionName, queryParams, newData, option) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).updateOne(queryParams, newData, option, (err, res) => {
          if (err) return reject(err)
          resolve(true)
        })
      })
    })
  }

  updateMany (collectionName, queryParams, newData, option) {
    const _that = this
    return new Promise((resolve, reject) => {
      this.connectDB().then(() => {
        _that.db.collection(collectionName).updateMany(queryParams, newData, (err, res) => {
          if (err) return reject(err)
          resolve(true)
        })
      })
    })
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
