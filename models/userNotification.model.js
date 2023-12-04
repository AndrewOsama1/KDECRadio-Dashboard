const { Sequelize, DataTypes } = require("sequelize")

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('userNotification', {
        title: {
            allowNull: false,
            type: DataTypes.STRING
        },
        content: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        sendAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    })