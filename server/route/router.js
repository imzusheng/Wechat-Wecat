const router = require('@koa/router')()
const routeAdmin = require('./admin')
const routeLogin = require('./login')
const common = require('./common')

router
  .use(common)
  .use(routeAdmin)
  .use(routeLogin)

module.exports = router
