const router = require('@koa/router')()
const MongoDB = require('../module/mongodb')
const db = new MongoDB()
const fs = require('fs')
const path = require('path')
const config = require('../config')
// const multer = require('@koa/multer')
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, config.staticPath)
//   },
//   filename: function (req, file, cb) {
//     cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
//   }
// })
// const upload = multer({ // 源码中multer是一个函数，所以需要执行
//   storage: storage
// })
const MIME = require('../MIME.js')

/**
 * @api {Get} /wechatAPI/common/chatHistory 获取历史聊天记录
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router.get('/wechatAPI/common/chatHistory', async (ctx) => {
  const data = ctx.query
  const queryMatch = {
    $match: {
      userID: data.email
    }
  }

  const queryProject = {
    $project: {
      _id: 0,
      userID: 0
    }
  }

  const queryLookup = {
    $lookup: {
      from: 'user', // 和user表关联查询
      let: {
        email: '$chatObj'
      },
      pipeline: [ // 管道
        {
          $match:
            {
              $expr: { // 使用let中的变量
                $and:
                  [{ $eq: ['$email', '$$email'] }] // $eq 相等  $email是user表中的email，$$email是let中的变量
              }
            }
        },
        {
          $project: {
            _id: 0,
            pwd: 0
          }
        }
      ],
      as: 'friendInfo'
    }
  }

  const queryUnwind = {
    $unwind: {
      path: '$friendInfo',
      preserveNullAndEmptyArrays: true
    }
  }

  /** 查询聊天记录 */
  const chatRecordResult = await db.aggregate('chatRecord', [queryMatch, queryProject, queryLookup, queryUnwind], { currentChatDate: -1 })
  const result = {}
  chatRecordResult.forEach(Obj => {
    result[Obj.chatObj] = Obj
  })
  ctx.body = {
    result,
    error: false,
    msg: '获取聊天记录成功'
  }
})
/**
 * @api {Get} /wechatAPI/common/navSearch 全局搜索用户
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router.get('/wechatAPI/common/navSearch', async (ctx) => {
  const data = ctx.query
  if (!data.email) return
  const queryMatch = {
    $match: {
      $or: [
        { email: { $regex: new RegExp(data.email) } },
        { nickName: { $regex: new RegExp(data.nickName) } }
      ],
      email: { $nin: [data.userID] } // 搜索当然要不包括自己啦
    }
  }

  const queryProject = {
    $project: {
      _id: 0,
      pwd: 0,
      access: 0,
      time: 0,
      RecentlyTime: 0,
      address: 0
    }
  }
  const result = await db.aggregate('user', [queryMatch, queryProject])
  ctx.body = {
    error: false,
    msg: '查找成功',
    result
  }
})
/**
 * @api {Get} /wechatAPI/common/userConfig 获取用户配置
 * @apiName 3
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "uid": "imzusheng@163.com"
 * }
 */
router.get('/wechatAPI/common/userConfig', async (ctx) => {
  const data = ctx.query
  const queryMatch = {
    $match: {
      uid: data.uid
    }
  }

  const queryProject = {
    $project: {
      _id: 0
    }
  }
  const userConfigResult = await db.aggregate('userConfig', [queryMatch, queryProject])
  if (userConfigResult.length === 0) {
    // 查不出数据就给他一个默认值吧
    ctx.body = {
      error: false,
      msg: '查找成功',
      config: {
        timeSwitch: true,
        sendKeyCode: false,
        pageSize: 10
      }
    }
  } else {
    ctx.body = {
      error: false,
      msg: '查找成功',
      config: userConfigResult[0].config
    }
  }
})
/**
 * @api {Put} /wechatAPI/common/userConfig/put 修改用户配置
 * @apiName 4
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "uid": "imzusheng@163.com",
 *   "config": {}
 * }
 */
router.put('/wechatAPI/common/userConfig/put', async (ctx) => {
  const data = ctx.request.body
  const result = await db.updateOne('userConfig', { uid: data.uid }, { $set: { config: data.config } }, { upsert: true }).then()
  if (!result) console.error('更新用户配置失败 -> router.put -> common/userConfig')
  ctx.body = {
    error: false,
    msg: '查找成功'
  }
})
/**
 * @api {Post} /wechatAPI/common/upload/beforeUpload 上传前文件查重
 * @apiName 5
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiParam postfix 文件后缀名
 * @apiParam hash
 *
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "exist": true, // 服务器已存在该文件
 *   "filePath": "" // 服务器已经存在该文件，返回文件名
 * }
 *
 */
router.post('/wechatAPI/common/upload/beforeUpload', async (ctx) => {
  const {
    postfix,
    hash
  } = ctx.request.body
  const filePath = path.join(config.staticPath, `${hash + '.' + postfix}`)
  const filePacketPath = path.join(config.staticPath, hash)
  let exist
  let resultFilePath = ''
  try {
    // 检查 文件 是否存在于当前目录中。
    fs.accessSync(filePath, fs.constants.F_OK)
    exist = true
    resultFilePath = `${hash}.${postfix}` // 服务器已经存在该文件，返回文件名
  } catch (e) {
    exist = false
  }

  if (!exist) {
    try {
      // 检查 文件夹 是否存在于当前目录中。
      fs.accessSync(filePacketPath, fs.constants.F_OK)
      console.log('commonRouter.js -> wechatAPI/common/upload/beforeUpload -> 分片文件夹存在')
    } catch (e) {
      console.log('commonRouter.js -> wechatAPI/common/upload/beforeUpload -> 分片文件夹不存在')
      fs.mkdirSync(filePacketPath, err => {
        if (err) console.error(err)
      })
    }
  }

  ctx.body = {
    filePath: resultFilePath, // 服务器已经存在该文件，返回文件名
    exist, // 存在则为true
    error: false
  }
})
/**
 * @api {Post} /wechatAPI/common/uploadV2 上传文件
 * @apiName 6
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router.post('/wechatAPI/common/uploadV2', async (ctx) => {
  const {
    hash, // 文件hash值
    chunkIndex // 分片下标
    // chunksTotal // 分片总数
  } = ctx.request.body
  const file = ctx.request.files.file
  const filePacketName = `${config.staticPath + hash}` // 文件夹名字
  const chunksFileName = path.join(filePacketName, `${chunkIndex}`) // 每个分片的保存路径
  // 创建可读流
  const reader = fs.createReadStream(file.path)
  // 创建可写流
  const upStream = fs.createWriteStream(chunksFileName)
  // // 可读流通过管道写入可写流
  reader.pipe(upStream)
  ctx.body = {
    error: false
  }
})
/**
 * @api {Post} /wechatAPI/common/upload/merge 上传文件结束，合并分片
 * @apiName 7
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "exist": true, // 服务器已存在该文件
 *   "filePath": "" // 服务器已经存在该文件，返回文件名
 * }
 */
router.post('/wechatAPI/common/upload/merge', async (ctx) => {
  const {
    postfix,
    hash,
    name
  } = ctx.request.body

  const filePath = path.join(config.staticPath, `${hash + '.' + postfix}`)
  const filePacketPath = path.join(config.staticPath, hash)
  const chunks = fs.readdirSync(filePacketPath)
  chunks.forEach((chunk, i) => {
    fs.appendFileSync(filePath, fs.readFileSync(path.join(filePacketPath, `${i + 1}`)))
    fs.unlinkSync(path.join(filePacketPath, `${i + 1}`))
  })
  fs.rmdirSync(filePacketPath)
  ctx.body = {
    error: false,
    filePath: `${hash + '.' + postfix}`,
    name
  }
})
/**
 * @api {Put} /wechatAPI/common/static 静态服务
 * @apiName 8
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 */
router.get('/wechatAPI/static', async (ctx) => {
  const postfix = ctx.query.filename.slice(ctx.query.filename.indexOf('.'), ctx.query.filename.length)
  const fileName = encodeURIComponent(ctx.query.filename) // Content-Disposition 需要转换
  ctx.set({
    'Content-Type': `${MIME[postfix]}`,
    'Content-Disposition': `attachment; filename=${fileName}`
  })
  ctx.body = await fs.readFileSync(config.staticPath + ctx.query.filename)
})
/**
 * @api {Get} /wechatAPI/common/contact 获取好友列表
 * @apiName 9
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router.get('/wechatAPI/common/contact', async (ctx) => {
  const queryMatch = {
    $match: {
      UID: ctx.query.email
    }
  }

  const queryProject = {
    $project: {
      _id: 0
    }
  }

  // const queryLookup = {
  //   $lookup: {
  //     from: 'user', // 关联到order表
  //     localField: 'Friend', // user 表关联的字段
  //     foreignField: 'email', // order 表关联的字段
  //     as: 'friendInfo'
  //   }
  // }

  const queryLookup = {
    $lookup: {
      from: 'user', // 和user表关联查询
      let: {
        email: '$Friend' // 把源表查询出的Friend赋值给email
      },
      pipeline: [ // 管道
        {
          $match:
            {
              $expr: { // 使用let中的变量
                $and:
                  [{ $eq: ['$email', '$$email'] }] // $eq 相等
              }
            }
        },
        {
          $project: {
            _id: 0,
            pwd: 0
          }
        }
      ],
      as: 'friendInfo'
    }
  }

  const queryUnwind = {
    $unwind: {
      path: '$friendInfo',
      preserveNullAndEmptyArrays: true
    }
  }

  const friendResult = await db.aggregate('friend', [queryMatch, queryProject, queryLookup, queryUnwind])
  const result = {}
  friendResult.forEach(Obj => {
    result[Obj.Friend] = Obj
  })
  ctx.body = {
    result,
    error: false,
    msg: 'success'
  }
})
/**
 * @api {Get} /wechatAPI/common/deleteAllRecord 删除所有聊天记录
 * @apiName 10
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router.get('/wechatAPI/common/deleteAllRecord', async (ctx) => {
  // { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
  db.updateMany('chatRecord',
    {},
    {
      $pull: { chat: { msg: { $nin: ['已通过好友申请'] } } }
    }
  ).then()
  ctx.body = {
    error: false,
    msg: 'success'
  }
})
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */
/**
 * 分割线
 */

router
  .get('/api/friendApply', async (ctx) => {
    const friendResult = await db.find('friendApply', {
      'to.email': ctx.query.uid,
      status: false
    })
    ctx.body = {
      friendList: friendResult,
      type: 'friendApply'
    }
  })

router
  .get('/api/chatRecord', async (ctx) => {
    const queryData = {}
    queryData.userID = ctx.query.uid
    queryData.chatObj = ctx.query.chatObj
    const result = await db.find('chatRecord', queryData) // 查询数据
    ctx.body = {
      uid: ctx.query.uid,
      type: 'chatRecord',
      result: result ? result[0].chat : []
    }
  })

module
  .exports = router.routes()
