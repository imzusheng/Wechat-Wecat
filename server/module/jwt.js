const jwt = require('jsonwebtoken')

module.exports = class jwtClass {
  getToken (uid) {
    return jwt.sign({ // 生成token
      exp: Math.floor(Date.now() / 1000) + (60 * 30),
      data: `${uid}pass`
    }, 'shhhhh')
  }

  tokenVerify (ctx) {
    return new Promise((resolve, reject) => {
      const token = ctx.header.authorization
      jwt.verify(token, 'shhhhh', {}, function (err, decoded) {
        console.log(err)
        if (err) resolve(401)
        else resolve(200)
      })
    })
  }
}
