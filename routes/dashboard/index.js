const { Router } = require("express")
const { authorized } = require("../../middlewares/auth")
const { getAll, exportUsers } = require("../../controllers/users").dashboard
const { getChats } = require("../../controllers/chats")
const authRouter = require("./auth")
const categoryRouter = require("./category")
const albumRouter = require("./album")
const notificationRouter = require("./notification")
const songRouter = require("./song")
const back = require("../../middlewares/back")

const dashboardRouter = Router()

dashboardRouter.use(back)

dashboardRouter.use('/', authRouter)
dashboardRouter.use(authorized)

dashboardRouter.use('/categories', categoryRouter)
dashboardRouter.use('/album', albumRouter)
dashboardRouter.use('/song', songRouter)
dashboardRouter.use('/notification', notificationRouter)

dashboardRouter.get('/users', getAll)
dashboardRouter.get('/users/export', exportUsers)
dashboardRouter.get('/chats', getChats)

module.exports = dashboardRouter
