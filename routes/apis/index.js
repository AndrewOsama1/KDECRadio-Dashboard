const { Router } = require("express")
const { apiAuthorized } = require("../../middlewares/auth")
const authRouter = require("./auth")
const storageRouter = require("./storage")
const categoryRouter = require("./category")
const albumRouter = require("./album")
const songRouter = require("./song")
const userRouter = require("./user")
const apiLanguage = require("../../middlewares/apiLanguage")
const apiMessage = require("../../utils/messages.api")

const apiRouter = Router({ mergeParams: true })

apiRouter.use(apiLanguage)

apiRouter.use('/auth', authRouter)

apiRouter.use(apiAuthorized)

apiRouter.use('/category', categoryRouter)
apiRouter.use('/album', albumRouter)
apiRouter.use('/song', songRouter)
apiRouter.use('/storage', storageRouter)
apiRouter.use('/user', userRouter)

apiRouter.all(/.*/, (req, res) => res.status(404).json({ message: apiMessage("server.notFound", req.language)}))

module.exports = apiRouter
