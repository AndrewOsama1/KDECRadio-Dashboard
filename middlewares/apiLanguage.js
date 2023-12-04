module.exports = (req, res, next) => {
    let supportedLanguages = ['en', 'ar']
    let lang = req.params?.lang || "en"
    lang = lang.toLowerCase()
    if (!supportedLanguages.includes(lang)) lang = 'en'
    req.language = lang
    next()
}