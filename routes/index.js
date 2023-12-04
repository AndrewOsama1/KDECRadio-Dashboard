const { Router } = require("express")
const dashboardRouter = require("./dashboard")
const apiRouter = require("./apis")

const initRouter = Router()

initRouter.use('/api/:lang', apiRouter)
initRouter.use('/', dashboardRouter)

initRouter.all(/.*/, (req, res) =>
    res.render('notFound', { layout: false })
)

module.exports = initRouter
