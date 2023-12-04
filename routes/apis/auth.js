const { Router } = require("express")
const { notAuthorized } = require("../../middlewares/auth")
const { getToken } = require("../../controllers/auth").api

const authRouter = Router()

authRouter.post('/token', notAuthorized, getToken)

module.exports = authRouter
