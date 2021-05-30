const router = require('@koa/router')()
const config = require('../../config')
const fs = require('fs')
const path = require('path')
/**
 * @api {Post} /wechatAPI/upload/beforeUpload 上传前文件查重
 * @apiName 1
 * @apiVersion 1.0.0
 * @apiGroup 上传文件
 * @apiSampleRequest off
 *
 * @apiParam postfix 文件后缀名
 * @apiParam hash hash
 *
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "exist": true, // 服务器已存在该文件
 *   "filePath": "" // 服务器已经存在该文件，返回文件名
 * }
 *
 */
router.post('/wechatAPI/upload/beforeUpload', async (ctx) => {
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
 * @api {Post} /wechatAPI/upload/chunks 上传文件 分片
 * @apiName 2
 * @apiVersion 1.0.0
 * @apiGroup 上传文件
 * @apiSampleRequest off
 *
 * @apiParam FormData 包含的额外数据
 * @apiParam FormData.hash hash
 * @apiParam FormData.postfix 文件后缀，如'png'
 * @apiParam FormData.chunkIndex 当前分片的下标
 * @apiParam FormData.chunksTotal 分片总数
 *
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "message": '上传成功'
 * }
 */
router.post('/wechatAPI/upload/chunks', async (ctx) => {
  const {
    hash, // 文件hash值
    chunkIndex // 分片下标
    // chunksTotal // 分片总数
  } = ctx.request.body
  let error = false
  let message
  try {
    const file = ctx.request.files.file
    const filePacketName = `${config.staticPath + hash}` // 文件夹名字
    const chunksFileName = path.join(filePacketName, `${chunkIndex}`) // 每个分片的保存路径
    const reader = fs.readFileSync(file.path)
    fs.writeFileSync(chunksFileName, reader)
    // // 创建可读流
    // const reader = fs.createReadStream(file.path)
    // // 创建可写流
    // const upStream = fs.createWriteStream(chunksFileName)
    // // // 可读流通过管道写入可写流
    // reader.pipe(upStream)
    message = '上传成功'
  } catch (e) {
    error = true
    message = e
  }
  ctx.body = {
    error,
    message
  }
})
/**
 * @api {Post} /wechatAPI/upload/merge 上传文件结束，合并分片
 * @apiName 3
 * @apiVersion 1.0.0
 * @apiGroup 上传文件
 * @apiSampleRequest off
 *
 * @apiParam postfix 文件后缀名
 * @apiParam name 文件名
 * @apiParam hash hash
 *
 * @apiSuccessExample 成功响应示例
 * {
 *   "error": false,
 *   "filePath": true, // 服务器已存在该文件
 *   "name": "" // 文件名
 * }
 */
router.post('/wechatAPI/upload/merge', async (ctx) => {
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

module
  .exports = router.routes()
