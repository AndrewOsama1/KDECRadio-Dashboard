const { Router } = require("express")
const { warnConfirm, passwordConfirm } = require("../../middlewares/confirmations")
const { getAll, add, update, remove } = require("../../controllers/categories").dashboard

const categoryRouter = Router()

categoryRouter.get('/', getAll)

categoryRouter.post('/add', warnConfirm, add)
categoryRouter.post('/:id/update', warnConfirm, update)
categoryRouter.delete('/:id/delete', passwordConfirm, remove)

module.exports = categoryRouter
