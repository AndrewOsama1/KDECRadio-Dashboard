const { db } = require("../models/db.model")
const User = db.users

const userType = {
    uid: String(''),
    name: String(''),
    email: String(''),
    phone: String(''),
    age: Number()
}
const paginationType = {
    limit: Number(),
    page: Number()
}

exports.getAllUsersPaginated = async (where = {}, pagination = paginationType, order = []) => 
    await User.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: (pagination.page > 0 ? pagination.page - 1 : 0) * pagination.limit,
        order
    })

exports.getAllUsers = async (where = {}, order = []) => await User.findAll({ where, order, attributes: [ "email", "name", "phone", "age" ] })

exports.findUserByUid = async (uid = userType.uid) =>
    await User.findOne({ where: { uid }})

exports.createUser = async (user = userType) =>
    await User.create(user)
