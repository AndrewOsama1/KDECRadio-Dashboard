const { db } = require("../models/db.model")
const Category = db.categories

const categoryType = {
    categoryTitle: String('')
}

exports.getAllCategories = async (where = {}) => await Category.findAll({ where, order: [['createdAt', "ASC"]] })

exports.getCategoryById = async id => await Category.findOne({ where: { id }})

exports.getCategoryByName = async categoryTitle => await Category.findOne({ where: { categoryTitle }})

exports.createCategory = async (category = categoryType) => await Category.create(category)

exports.updateCategory = async (categoryTitle, id) => await Category.update({ categoryTitle }, { where: { id }})

exports.destroyCategory = async id => await Category.destroy({ where: { id }})
