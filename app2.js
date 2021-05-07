/*
// const { MongoClient } = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
function connectDB() {
    MongoClient.connect('mongodb://wcadmin:123456@localhost:27017/wecheck', { useUnifiedTopology: true },
        (err, client) => {
            if (err) throw err
            this.db = client.db('wecheck')
            console.log('链接数据库成功')
        })
}
connectDB() */
