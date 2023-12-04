const { Router } = require("express")
const { getAll, getCategoryAlbums } = require("../../controllers/categories").api

const categoryRouter = Router()

categoryRouter.get('/', getAll)
categoryRouter.get('/:id/albums', getCategoryAlbums)

module.exports = categoryRouter
