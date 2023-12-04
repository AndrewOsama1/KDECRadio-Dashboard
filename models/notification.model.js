const { Sequelize, DataTypes } = require("sequelize")

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('notification', {
        title:{
            allowNull: false,
            type: DataTypes.STRING
        },
        body: {
            allowNull: false,
            type: DataTypes.STRING
        },
        sendAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    })