const { Router } = require("express")
const { authorizedTwoFA, notAuthorized, authorized } = require("../../middlewares/auth")
const { loginPage, login, twoFAPage, checkCode, confirm, logout } = require("../../controllers/auth").dashboard

const authRouter = Router()
const twoFARouter = Router()

twoFARouter.get('/', authorizedTwoFA, twoFAPage)
twoFARouter.post('/submit', authorizedTwoFA, checkCode)

authRouter.get('/', notAuthorized, (req, res) => res.render('login', { layout: false }))
authRouter.get('/login', notAuthorized, loginPage)
authRouter.post('/login', notAuthorized, login)
authRouter.delete('/logout', authorized, logout)

authRouter.post('/confirm/:type', authorized, confirm)

authRouter.use('/2fa', twoFARouter)

module.exports = authRouter
