const router = require('@koa/router')()
const commonRouter = require('./commonRouter')
const routeAdmin = require('./admin')
const routeLogin = require('./login')

router
  .use(commonRouter)
  .use(routeAdmin)
  .use(routeLogin)

module.exports = router
