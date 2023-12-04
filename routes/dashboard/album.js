const { Router } = require("express")
const { getOne, add, update, remove } = require("../../controllers/albums").dashboard
const { albumsUploader } = require("../../middlewares/fileUpload")
const { warnConfirm, passwordConfirm } = require("../../middlewares/confirmations")

const albumRouter = Router()

albumRouter.get('/:id', getOne)

albumRouter.post('/add', warnConfirm, albumsUploader.single('imageCover'), add)
albumRouter.post('/:id/update', warnConfirm, albumsUploader.single('imageCover'), update)
albumRouter.delete('/:id/delete', passwordConfirm, remove)

module.exports = albumRouter
