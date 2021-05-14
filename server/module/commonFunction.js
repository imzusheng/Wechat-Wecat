const EmailServer = require('../module/EmailServer')
const JsonWebToken = require('../module/jwt')
const jwt = new JsonWebToken()
module.exports = {
  /**
   * 发送验证码邮件，返回Promise
   * @param params
   * @returns {Promise | Promise<unknown>}
   */
  sendEmail: (params) => {
    EmailServer(params).then(
      resolve => {
        return true
      },
      reject => {
        return false
      }
    )
  },
  /**
   * 验证token
   */
  verifyToken: async (ctx, next) => {
    ctx.set('Content-Type', 'application/json')
    if (/(login|sign)/g.test(ctx.url)) return next()
    const verify = await jwt.tokenVerify(ctx)
    ctx.status = verify
    if (verify === 401) {
      ctx.body = {
        msg: '身份认证已过期',
        error: true
      }
    } else {
      next()
    }
  }
}
