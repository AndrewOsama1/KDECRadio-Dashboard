const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('album', {
        albumName: {
            allowNull: false,
            type: DataTypes.STRING
        },
        imgPath: {
            allowNull: false,
            type: DataTypes.TEXT
        },
    }, {
        uniqueKeys: {
            unique_albumName_categoryId: {
                fields: ['albumName', 'categoryId']
            }
        }
    })
