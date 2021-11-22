const router = require('@koa/router')()
const MongoDB = require('../../src/module/mongodb')
const db = new MongoDB()
const fs = require('fs')
const config = require('../../config')
const MIME = require('../../MIME.js')
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
      // $in 表示包含的多个值
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
 * @api {Get} /wechatAPI/static 静态服务-需要权限
 * @apiName 5
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 */
router.get('/wechatAPI/static', async (ctx) => {
  let data
  try {
    const postfix = ctx.query.filename.slice(ctx.query.filename.indexOf('.'), ctx.query.filename.length)
    const fileName = encodeURIComponent(ctx.query.raw) // Content-Disposition 需要转换
    ctx.set({
      'Content-Type': `${MIME[postfix]}`,
      'Content-Disposition': `attachment; filename=${fileName}`
    })
    data = await fs.readFileSync(config.staticPath + ctx.query.filename)
  } catch (e) {
    data = e
  }
  ctx.body = data
})

/**
 * @api {Get} /wechatAPI/common/contact 获取好友列表
 * @apiName 6
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
 * @apiName 7
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router.get('/wechatAPI/common/deleteAllRecord', async (ctx) => {
  // { $pull: { fruits: { $in: [ "apples", "oranges" ] }, vegetables: "carrots" } },
  db.updateMany('chatRecord',
    {},
    {
      $pull: {
        chat: { msg: { $nin: ['已通过好友申请'] } }
      },
      $set: { count: 1 }
    }
  ).then()
  db.updateMany('chatRecord',
    {},
    {
      $pull: {
        chat: { msg: { $nin: ['已通过好友申请'] } }
      },
      $set: { chat: { count: 1 } }
    },
    {
      upsert: true
    }
  ).then()
  ctx.body = {
    error: false,
    msg: 'success'
  }
})

/**
 * @api {Get} /wechatAPI/common/unRead 获取未读消息记录
 * @apiName 8
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiParam uid 用户名
 *
 * @apiSuccessExample 成功响应示例
 * unReadMessage: [
 *      { from: 'imshanni@163.com', count: 54 },
 *      { from: 'imzusheng@163.com', count: 1 },
 *      { from: 'imshanni@163.com', count: 2 },
 *      { from: 'imyvzhou@163.com', count: 12 },
 *      { from: 'wenjian@163.com', count: 9 }
 * ]
 */
router.get('/wechatAPI/common/unRead', async (ctx) => {
  const queryMatch = {
    $match: {
      to: ctx.query.uid
    }
  }

  const queryProject = {
    $project: {
      _id: 0,
      to: 0
    }
  }
  const unReadMessage = await db.aggregate('unReadMessage', [queryMatch, queryProject])
  const unReadMessageObj = {}
  unReadMessage.forEach(item => {
    unReadMessageObj[item.from] = item.count
  })
  ctx.body = {
    unReadMessage: unReadMessageObj
  }
})

/**
 * @api {Get} /wechatAPI/common/friendApply 获取好友请求
 * @apiName 9
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiParam uid 用户名
 *
 * @apiSuccessExample 成功响应示例
 * friendApply: [
 *      { from: 'imshanni@163.com', count: 54 },
 *      { from: 'imzusheng@163.com', count: 1 },
 *      { from: 'imshanni@163.com', count: 2 },
 *      { from: 'imyvzhou@163.com', count: 12 },
 *      { from: 'wenjian@163.com', count: 9 }
 * ]
 */
router.get('/wechatAPI/common/friendApply', async (ctx) => {
  const queryMatch = {
    $match: {
      to: ctx.query.uid,
      status: false
    }
  }

  const queryProject = {
    $project: {
      _id: 0,
      to: 0,
      type: 0
    }
  }
  const friendApply = await db.aggregate('friendApply', [queryMatch, queryProject])
  ctx.body = {
    friendApply
  }
})

/**
 * @api {Put} /wechatAPI/common/userInfo/put 修改用户信息
 * @apiName 10
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "uid": "imzusheng@163.com",
 *   "nickName": "",
 *   "Individuality": ""
 * }
 */
router.put('/wechatAPI/common/userInfo/put', async (ctx) => {
  const {
    uid,
    nickName,
    Individuality
  } = ctx.request.body
  const result = await db.updateOne(
    'user',
    { email: uid },
    {
      $set: {
        nickName,
        Individuality
      }
    },
    { upsert: true }).then()
  if (!result) console.error('更新用户信息失败 -> router.put -> common/userInfo')
  ctx.body = {
    error: false,
    msg: '修改成功'
  }
})

/**
 * @api {Put} /wechatAPI/common/userInfo/avatar/put 修改用户头像
 * @apiName 11
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 * @apiExample 请求示例:
 * {
 *   "uid": "imzusheng@163.com",
 *   “avatar”: ""
 * }
 */
router.put('/wechatAPI/common/userInfo/avatar/put', async (ctx) => {
  const {
    uid,
    avatar
  } = ctx.request.body
  const result = await db.updateOne(
    'user',
    { email: uid },
    {
      $set: {
        avatar
      }
    },
    { upsert: true }).then()
  if (!result) console.error('更新用户信息失败 -> router.put -> common/userInfo')
  ctx.body = {
    error: false,
    msg: '修改成功'
  }
})

router.put('/wechatAPI/common/userConfig/put', async (ctx) => {
  const data = ctx.request.body
  const result = await db.updateOne('userConfig', { uid: data.uid }, { $set: { config: data.config } }, { upsert: true }).then()
  if (!result) console.error('更新用户配置失败 -> router.put -> common/userConfig')
  ctx.body = {
    error: false,
    msg: '查找成功'
  }
})

module
  .exports = router.routes()
