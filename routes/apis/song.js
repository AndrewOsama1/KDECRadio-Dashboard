const { Router } = require("express")
const { search, view } = require("../../controllers/songs").api

const songRouter = Router()

songRouter.get('/', search)
songRouter.post('/:id/view', view)

module.exports = songRouter
