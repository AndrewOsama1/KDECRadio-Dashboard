const { Router } = require("express")
const { getOne, getUserNotifications, add, update, addUserNotification, remove } = require("../../controllers/users").api

const userRouter = Router()

userRouter.get('/:uid', getOne)
userRouter.post('/add', add)
userRouter.put('/:uid/update', update)
userRouter.delete('/:uid/remove', remove)
userRouter.get('/:uid/notification', getUserNotifications)
userRouter.post('/:uid/notification/add', addUserNotification)

module.exports = userRouter
