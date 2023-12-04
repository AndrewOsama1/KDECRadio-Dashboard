const { Router } = require("express")
const { add, update, remove } = require("../../controllers/songs").dashboard
const { songsUploader } = require("../../middlewares/fileUpload")
const { warnConfirm } = require("../../middlewares/confirmations")

const songRouter = Router()

songRouter.post('/add', warnConfirm, songsUploader.single('song'), add)
songRouter.post('/:id/update', warnConfirm, songsUploader.single('song'), update)
songRouter.delete('/:id/delete', warnConfirm, remove)

module.exports = songRouter
