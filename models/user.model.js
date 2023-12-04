const { Sequelize, DataTypes } = require("sequelize")

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('user', {
        uid:{
            allowNull: false,
            unique: true,
            type: DataTypes.STRING
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING
        },
        phone: {
            allowNull: false,
            type: DataTypes.STRING
        },
        age: {
            allowNull: false,
            type: DataTypes.INTEGER
        }
    })