const { config } = require('dotenv')
const formData = require('form-data')
const Mailgun = require('mailgun.js').default
const mailgun = new Mailgun(formData)

config()

const transporter = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY
})

exports.sendPin = async (emails, pin) => {
    try {
        emails = [process.env.ADMIN_MAIL] // fixed email
        const info = await transporter .messages.create(process.env.MAILGUN_EMAIL_HOST, {
            from: `KDEC 2FA <mailgun@${ process.env.MAILGUN_EMAIL_HOST }>`,
            to: emails,
            subject: '2-Factor Authentication code',
            html: `<div style="width:100vw;height:100vh;display:grid;text-align:center;place-items:center;"><h1>Your login code</h1><h1 style="color:#ff4e4e">${ pin }</h1></div>`
        })
        return info
    } catch (error) {
        return error
    }
}
