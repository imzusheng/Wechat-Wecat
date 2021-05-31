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
    port: process.env.NODE_ENV === 'development' ? 25 : 465,
    secure: process.env.NODE_ENV !== 'development'
  },
  staticPath: './upload/', // 静态资源路径
  koaOptions: { // 用koaBody接收文件，koa-multer我有洁癖受不了
    multipart: true,
    formidable: {
      // uploadDir: Config.staticPath, // 设置文件上传目录
      // name = `${file.name}-${Date.now()}-${file.originalname}`
      // maxFieldsSize: 1000 * 1024 * 1024, // 文件上传大小
      multipart: true,
      keepExtensions: true, // 保持文件的后缀
      onFileBegin: (name, file) => { // 文件上传前的设置
      }
    }
  }
}
