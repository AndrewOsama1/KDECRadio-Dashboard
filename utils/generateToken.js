const { sign } = require('jsonwebtoken')


exports.genreateAccessToken = (payload, secret, durationInMinutes) => {
    if (durationInMinutes)
        return sign(payload, secret, { expiresIn: durationInMinutes / 1000 })
    else return sign(payload, secret)
}