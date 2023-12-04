const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('admin', {
        email: {
            allowNull: false,
            type: DataTypes.STRING
        },
        username: {
            allowNull: false,
            type: DataTypes.STRING
        },
        password: {
            allowNull: false,
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.INTEGER,
            validate: { min: 1, max: 3 },
            defaultValue:1
        },
        twoFACode: {
            type: DataTypes.STRING,
            defaultValue:null,
            allowNull: true
        },
        isConfirmed: {
            type: DataTypes.STRING,
            defaultValue: false,
            allowNull: true
        }
    })
