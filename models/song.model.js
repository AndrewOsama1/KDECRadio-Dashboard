const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize = new Sequelize()) =>
    sequelize.define('song', {
        author: {
            allowNull: true,
            type: DataTypes.STRING
        },
        songName: {
            allowNull: false,
            type: DataTypes.STRING
        },
        path: {
            allowNull: false,
            type: DataTypes.TEXT
        },
        views: {
            allowNull: false,
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        lang:{
            allowNull: false,
            type: DataTypes.STRING
        }
    },{
        uniqueKeys: {
            unique_songName_albumId_categoryId: {
                fields: ['songName', 'albumId', 'categoryId']
            }
        }
    })
