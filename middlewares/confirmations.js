const { findAdminById } = require("../utils/admin.db")

exports.warnConfirm = async (req, res, next) => {
    let { id, warnConfirmed } = req.admin
    if (warnConfirmed){
        let admin = await findAdminById(id)
        admin.isConfirmed = null
        await admin.save()
        next()
    } else {
        res.cookie('event','err-1006')
        res.redirect('/categories')
    }
}

exports.passwordConfirm = async (req, res, next) => {
    let { id, passwordConfirmed } = req.admin
    if (passwordConfirmed){
        let admin = await findAdminById(id)
        admin.isConfirmed = null
        await admin.save()
        next()
    } else {
        res.cookie('event','err-1007')
        res.redirect('..')
    }
}
