const { hash, compare } = require('bcrypt')

exports.generate = async str => await hash(str, 9)

exports.compare = async (input, hash) => await compare(input, hash)
