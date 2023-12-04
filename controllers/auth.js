const { findAdminById, findAdminByEmail } = require("../utils/admin.db");
const { compare } = require("../utils/bcrypt.utils");
const { getPin } = require("../utils/generatePin");
const { genreateAccessToken } = require("../utils/generateToken");
const apiMessage = require("../utils/messages.api");
const { sendPin } = require("../utils/sendMail");
const { findUserByUid } = require("../utils/users.db");

const tokenAge = 24 * 60 * 60 * 1000
const codeAge = 10 * 60 * 1000

module.exports = {
    dashboard: {
        loginPage: (req, res) => {
            res.render('login', { layout: false })
        },
        twoFAPage: async (req, res) => {
            res.render('2fa', { layout: false })
        },
        login: async (req, res) => {
            const { email, password } = req.body

            const admin = await findAdminByEmail(email)
            if (admin)
                if (await compare(password, admin.password)){
                    const token = genreateAccessToken({ val: admin.id }, process.env.JWT_2FA_SECRET, codeAge)
                    const pin = getPin()
                    const mail = await sendPin([process.env.ADMIN_MAIL], pin)
                    if (mail.status !== 200) console.log(pin)
                    admin.twoFACode = pin
                    await admin.save()
                    res.cookie('S_2FAT',`${ token }`,{ maxAge: codeAge, secured: process.env.NODE_ENV !== "development" })
                    res.redirect('/2fa')
                } // wrong password
                else {
                    res.cookie('event','err-1000')
                    res.redirect('/login')
                }
            // wrong username
            else {
                res.cookie('event','err-1000')
                res.redirect('/login')
            }
        },
        logout: async (req, res) => {
            res.clearCookie('S_UT')
            res.redirect('/login')
        },
        checkCode: async (req, res) => {
            const { code } = req.body
            const { id } = req.admin
            let admin = await findAdminById(id)
            let tokenSentDate = new Date(admin.updatedAt).getTime()
            let currentDate = Date.now()
            if ((currentDate - tokenSentDate) < codeAge)
                if (admin.twoFACode === code) {
                    admin.twoFACode = null
                    const token = genreateAccessToken({ val: req.admin.id }, process.env.JWT_SECRET, tokenAge)
                    res.clearCookie('S_2FAT')
                    res.cookie('S_UT',`${ token }`,{ maxAge: tokenAge, secured: process.env.NODE_ENV !== "development" })
                    res.redirect('/categories')
                }
                // code does not match.
                else {
                    res.cookie('event','err-1001')
                    res.redirect('/2fa')
                }
            else {
                admin.twoFACode = null
                res.cookie('event','err-1009')
                res.redirect('/2fa')
            }
            admin.save()
        },
        confirm: async (req, res) => {
            const { confirmValue } = req.body
            const { type } = req.params
            const { id } = req.admin
            try {
                let admin = await findAdminById(id)
                switch (type) {
                    case 'warn':
                        if (confirmValue == 'CONFIRM'){
                            admin.isConfirmed = 'warnConfirmed'
                            await admin.save()
                            res.status(200).json({ message: "Confirmed" })
                        } else res.status(401).json({ message: "Incorrect" })
                    break
                    case 'password':
                        if (await compare(confirmValue, admin.password)){
                            admin.isConfirmed = 'passwordConfirmed'
                            await admin.save()
                            res.status(200).json({ message: "Confirmed" })
                        } else res.status(401).json({ message: "Incorrect password" })
                    break
                    default: res.status(418).json({ message: 'Undefined confirmation type' })
                }
            } catch (error) {
                res.cookie('event','err-1008')
                res.status(500).json({ message: "Something went wrong" })
            }
        }
    },
    api:{
        getToken: async (req, res) => {
            try {
                const { uid } = req.body
                let user = await findUserByUid(uid)
                if (!user)  res.status(404).json({ message: apiMessage("user.notFound", req.language)})
                else {
                    const token = genreateAccessToken({ val: uid }, process.env.JWT_SECRET, tokenAge)
                    res.status(201).json({ results: { token }})
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        }
    }
}
