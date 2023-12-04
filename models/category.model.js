const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('category', {
        categoryTitle: {
            allowNull: false,
            type: DataTypes.STRING,
            unique: true
        },
    })
