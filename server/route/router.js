const router = require('@koa/router')()
const commonRouter = require('./commonRouter')
const routeAdmin = require('./admin')
const routeLogin = require('./login')

router
  .use(routeLogin)
  .use(commonRouter)
  .use(routeAdmin)

module.exports = router
