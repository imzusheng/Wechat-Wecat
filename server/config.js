module.exports = {
  // 'mongodb://wcadmin:123456@localhost:27017/wecheck'
  mongoUrl: 'mongodb://localhost:27017/wecat', // ?authSource=admin
  dbName: 'wecat',
  serverPort: 3800,
  wsServerPort: 4800,
  email: {
    host: 'smtp.163.com',
    user: 'imzusheng@163.com',
    pass: 'HNPJUKBWLOXHVQMT',
    port: 25,
    secure: false
  }
}
