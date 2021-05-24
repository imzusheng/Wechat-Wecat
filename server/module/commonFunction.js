const EmailServer = require('../module/EmailServer')
const JsonWebToken = require('../module/jwt')
const jwt = new JsonWebToken()
module.exports = {
  /**
   * 发送验证码邮件，返回Promise
   */
  sendEmail: async (params) => {
    return await EmailServer(params)
  },
  /**
   * 验证token
   */
  verifyToken: async (ctx, next) => {
    if (/(login|sign|static)/g.test(ctx.url)) return next()
    const verify = await jwt.tokenVerify(ctx)
    ctx.status = 200
    if (verify === 401) {
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
