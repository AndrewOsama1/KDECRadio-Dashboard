const { verify } = require("jsonwebtoken")
const { findAdminById } = require("../utils/admin.db")
const { findUserByUid } = require("../utils/users.db")
const apiMessage = require("../utils/messages.api")

const noAuthApis = [
    { method: "POST", path: "/auth/token" },
    { method: "POST", path: "/user/add" }
]

exports.authorized = (req, res, next) => {
    if (req.cookies.S_UT){
        const token = req.cookies.S_UT
        verify(token, process.env.JWT_SECRET, async (err, payload)=> {
            if (err) {
                // wrong token.
                res.clearCookie('S_UT')
                res.redirect('/login')
            } else {
                const admin = await findAdminById(payload.val)
                if (!admin) {
                    // user not found.
                    res.clearCookie('S_UT')
                    res.redirect('/login')
                }
                req.admin = { id: admin.id, username: admin.username }
                switch (admin.isConfirmed){
                    case 'warnConfirmed':
                        req.admin.warnConfirmed = true
                    break
                    case 'passwordConfirmed':
                        req.admin.passwordConfirmed = true
                    break
                    default:
                        admin.isConfirmed = null
                        await admin.save()
                    break
                }
                next()
            }
        })
    } // no token
    else 
        if (req.cookies.S_2FAT) {
            res.cookie('event','err-1002')
            res.redirect('/2fa')
        }
        else {
            res.cookie('event','err-1003')
            res.redirect('/login')
        }
}

exports.apiAuthorized = (req, res, next) => {
    if (req.cookies.S_UT){
        const token = req.cookies.S_UT
        verify(token, process.env.JWT_SECRET, async (err, payload)=> {
            if (err) {
                // wrong token.
                res.status(401).json({ message: apiMessage("auth.wrongToken", req.language) })
            } else {
                if (typeof payload.val === "number"){
                    const admin = await findAdminById(payload.val)
                    if (admin) {
                        req.admin = { id: admin.id, username: admin.username }
                        next()
                    } else {
                        res.status(401).json({ message: apiMessage("auth.invalidToken", req.language) })
                    }
                } else{
                    const user = await findUserByUid(payload.val)
                    if (!user){
                        res.status(401).json({ message: apiMessage("auth.invalidToken", req.language) })
                    } else next()
                }
            }
        })
    } // no token
    else
        if (noAuthApis.find(({ path, method })=> path == req.path && method == req.method))
            next()
        else
            res.status(401).json({ message: apiMessage("auth.noToken", req.language) })
}

exports.authorizedTwoFA = (req, res, next) => {
    if (req.cookies.S_2FAT){
        const token = req.cookies.S_2FAT
        verify(token, process.env.JWT_2FA_SECRET, async (err, payload)=> {
            if (err) {
                // wrong token.
                res.cookie('event','err-1004')
                res.clearCookie('S_2FAT')
                res.redirect('/login')
            } else {
                const admin = await findAdminById(payload.val)
                if (!admin) {
                    // user not found.
                    res.cookie('event','err-1004')
                    res.clearCookie('S_2FAT')
                    res.redirect('/login')
                } else {
                    req.admin = admin
                    next()
                }
            }
        })
    } // no token
    else res.redirect('/login')
}

exports.notAuthorized = (req, res, next) => {
    if (req.cookies.S_UT) {
        res.cookie('event','err-1005')
        res.redirect(req.back)
    }
    else next()
}
