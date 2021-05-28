const EmailServer = require('../module/EmailServer')
const JsonWebToken = require('../module/jwt')
const jwt = new JsonWebToken()
module.exports = {
  /**
   * 发送验证码邮件，return Promise
   */
  sendEmail: async (params) => {
    return await EmailServer(params)
  },
  /**
   * 验证token
   */
  verifyToken: async (ctx, next) => {
    if (/(login|sign|static)/g.test(ctx.url)) return next() // 登录、注册、获取静态文件不需要验证权限
    const verify = await jwt.tokenVerify(ctx)
    ctx.status = 200
    if (verify === 401) { // 验证不通过
      ctx.body = {
        msg: '身份认证已过期',
        error: true,
        type: verify
      }
    } else {
      await next()
    }
  }
}
