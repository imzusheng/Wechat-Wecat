const jwt = require('jsonwebtoken')

module.exports = class jwtClass {
  getToken (uid) {
    return jwt.sign({ // 生成token
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      data: `${uid}pass`
    }, 'shhhhh')
  }

  tokenVerify (ctx) {
    return new Promise((resolve, reject) => {
      const token = ctx.header.authorization
      jwt.verify(token, 'shhhhh', function (err, decoded) {
        if (err) return resolve(204)
        resolve(200)
      })
    })
  }
}

/*
// 生成token
const token = jwt.sign({
  exp: Math.floor(Date.now() / 1000) + (60 * 60),
  data: 'pass'
}, 'shhhhh')
//  验证token
jwt.verify(token, 'shhhhh', function (err, decoded) {
  if (err) throw err
  // console.log(decoded.data)
})
*/
