const { db } = require("../models/db.model")
const Admin = db.admins

exports.findAdminById = async id => await Admin.findOne({ where: { id }})

exports.findAdminByEmail = async email => await Admin.findOne({ where: { email }})