const router = require('@koa/router')()
const commonRouter = require('./commonRouter')
const routeAdmin = require('./admin')
const routeLogin = require('./login')
const routeUpload = require('./upload')

router
  .use(routeLogin)
  .use(commonRouter)
  .use(routeUpload)
  .use(routeAdmin)

module.exports = router
