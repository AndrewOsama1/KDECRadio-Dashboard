module.exports = (req, res, next) => {
    req.back = req.headers.referer || '/categories'
    next()
}