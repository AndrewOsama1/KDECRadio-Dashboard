const { Router } = require("express")
const { getOne, getAlbumSongs } = require("../../controllers/albums").api

const albumRouter = Router()

albumRouter.get('/:id', getOne)
albumRouter.get('/:id/songs', getAlbumSongs)

module.exports = albumRouter
