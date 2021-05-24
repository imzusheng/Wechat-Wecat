const router = require('@koa/router')()
const MongoDB = require('../module/mongodb')
const db = new MongoDB()
const fs = require('fs')
const config = require('../config')
const multer = require('@koa/multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.staticPath)
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`)
  }
})
const upload = multer({ // 源码中multer是一个函数，所以需要执行
  storage: storage
})

/**
 * @api {Get} /wechatAPI/common/chatHistory 获取历史聊天记录
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router
  .get('/wechatAPI/common/chatHistory', async (ctx) => {
    try {
    /** 从聊天记录中查询数据 */
      const queryMatch = {
        $match: {
          userID: ctx.query.email
        }
      }

      const queryProject = {
        $project: {
          _id: 0
        }
      }
      /** 查询聊天记录 */
      const chatRecordResult = await db.aggregate('chatRecord', [queryMatch, queryProject], { currentChatDate: -1 })
      const queryParams = {
        $match: {
          $or: []
        }
      }
      const friendList = {}
      chatRecordResult.forEach(value => {
        friendList[value.chatObj] = value
        queryParams.$match.$or.push({
          email: value.chatObj
        })
      })
      // (TODO) 这里搞反了，应该用用户信息来查找聊天记录。万一聊天记录被删除完了呢
      /** 查询对应的用户信息 */
      const userInfoResult = await db.aggregate('user', [queryParams, queryProject])
      userInfoResult.forEach((value) => {
        friendList[value.email].friendInfo = value
      })
      ctx.body = {
        data: friendList,
        error: false,
        msg: '获取聊天记录成功'
      }
    } catch (e) {
      ctx.body = {
        error: true,
        msg: '获取聊天记录失败'
      }
    }
  })
/**
 * @api {Get} /wechatAPI/common/navSearch 全局搜索用户
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 */
router
  .get('/wechatAPI/common/navSearch', async (ctx) => {
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
router
  .get('/wechatAPI/common/userConfig', async (ctx) => {
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
router
  .put('/wechatAPI/common/userConfig/put', async (ctx) => {
    const data = ctx.request.body
    const result = await db.updateOne('userConfig', { uid: data.uid }, { $set: { config: data.config } }, { upsert: true }).then()
    if (!result) console.error('更新用户配置失败 -> router.put -> common/userConfig')
    ctx.body = {
      error: false,
      msg: '查找成功'
    }
  })

/**
 * @api {Put} /wechatAPI/common/upload 上传文件
 * @apiName 5
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 */
router.post('/wechatAPI/common/upload',
  upload.fields([
    {
      name: 'files',
      maxCount: 10
    }
  ]),
  async (ctx) => {
    const result = ctx.request.files.files.map(file => {
      return {
        originalname: file.originalname,
        filename: file.filename,
        status: true
      }
    })
    ctx.body = {
      error: false,
      result: result
    }
  })

/**
 * @api {Put} /wechatAPI/common/upload 读取静态资源
 * @apiName 6
 * @apiVersion 1.0.0
 * @apiGroup 通用
 * @apiSampleRequest off
 *
 */
router.get('/wechatAPI/static', async (ctx) => {
  ctx.response.type = 'Content-Type : image/png; charset=UTF-8'
  const data = await fs.readFileSync(config.staticPath + ctx.query.filename)
  ctx.body = data
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
