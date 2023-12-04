const { Sequelize } = require('sequelize')
require("dotenv").config()

const database = {
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    options: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: process.env.DB_PROVIDER,
        logging: process.env.DB_LOGGING == 'true' ? true : false,
        dialectOptions: { charset: process.env.DB_CHARSET },
        timezone: '+02:00',
        ssl: true
    }
}
const sequelize = new Sequelize(database.name, database.user, database.pass, database.options)

const db = {}
async function dbConnection() {
    try {
        await sequelize.authenticate()
        console.log('Connection has been established successfully.')
    }
    catch (error) {
        console.error('Unable to connect to the database:', error)
    }
}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.admins = require('./admin.model')(sequelize)
db.users = require('./user.model')(sequelize)
db.categories = require('./category.model')(sequelize)
db.albums = require('./album.model')(sequelize)
db.songs = require('./song.model')(sequelize)
db.notifications = require('./notification.model')(sequelize)
db.userNotifications = require('./userNotification.model')(sequelize)

/** categories has many albums 1 to m*/
db.categories.hasMany(db.albums, { as: "albums" })
db.albums.belongsTo(db.categories, {
    foreignKey: "categoryId",
    as: "category"
})

/** albums has many songs 1 to m */
db.albums.hasMany(db.songs, { as: "songs" })
db.songs.belongsTo(db.albums, {
    foreignKey: "albumId",
    as: "album"
})

/** categories has many songs 1 to m */
db.categories.hasMany(db.songs, { as: "songs" })
db.songs.belongsTo(db.categories, {
    foreignKey: "categoryId",
    as: "category"
})

/** users has many user_notifications 1 to m */
db.users.hasMany(db.userNotifications, { as: "userNotifications" })
db.userNotifications.belongsTo(db.users, {
    foreignKey: "userId",
    as: "userNotifications"
})

module.exports = { db, dbConnection }
