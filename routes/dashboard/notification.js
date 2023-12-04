const { Router } = require("express")
const { passwordConfirm } = require("../../middlewares/confirmations")
const { getAll, send } = require("../../controllers/notification").dashboard

const notificationRouter = Router()

notificationRouter.get('/', getAll)
notificationRouter.post('/send', passwordConfirm, send)

module.exports = notificationRouter
