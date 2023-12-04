const { default: axios } = require("axios")
const { config } = require('dotenv')
const { db } = require("./models/db.model")
const { getCategoryByName } = require("./utils/categories.db")
const { getAlbumByName } = require("./utils/albums.db")
const { getSongByName } = require("./utils/songs.db")
const { findUserByUid } = require("./utils/users.db")
const { generate } = require("./utils/bcrypt.utils")
process.env?.NODE_ENV != 'production' && config()

const baseUrl = process.env.SERVER_API

const http = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    timeout: 10000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    }
})

http.interceptors.response.use(
    res => res, 
    error => error.response
)

const migration = async () => {
    db.sequelize.sync({ alter: false, force: false })
    await db.admins.create({ email: process.env.ADMIN_MAIL, username: 'admin', password: await generate(process.env.ADMIN_PASS), isConfirmed: null })
    for (const { categoryTitle } of (await http.get('/category')).data)
        await db.categories.upsert({ categoryTitle })
    for (const { albumName, categoryName, imgPath } of (await http.get('/albums')).data)
        await db.albums.upsert({
            albumName,
            imgPath: `https://${process.env.S3_DOMAIN}/public/albums/${encodeURIComponent(imgPath)}`,
            categoryId: (await getCategoryByName(categoryName)).id
        })
    for (const { albumName, songName, views, id } of (await http.get('/songs/all')).data)
        await db.songs.upsert({
            songName: (await getSongByName(songName.split('.mp3')[0])) ? songName.split('.mp3')[0] + '-' + id : songName.split('.mp3')[0],
            author: "KDEC",
            views,
            lang: 'en',
            path: `https://${process.env.S3_DOMAIN}/public/songs/${encodeURIComponent(songName)}`,
            albumId: (await getAlbumByName(albumName)).id,
            categoryId: (await getAlbumByName(albumName)).categoryId
        })
    for (const { uid, email, name, phone, age } of (await http.get('/users')).data)
        await db.users.upsert({
            uid,
            email: email || 'anonymous',
            name: name || 'anonymous',
            phone: phone || 'anonymous',
            age
        })
    for (const { title, body, sendAt } of (await http.get('/notification/')).data)
        await db.notifications.upsert({ title, body, sendAt: new Date(sendAt).toISOString() })
    for (const { notifications, uid } of (await http.get('/users')).data)
        if (notifications.length > 0)
            for (const { title, body, sendAt } of notifications)
                await db.userNotifications.upsert({
                    title,
                    content: body,
                    sendAt: new Date(sendAt).toISOString(),
                    userId: (await findUserByUid(uid)).id
                })
}

console.time('migration')

migration()
.then(()=> console.timeEnd('migration'))
.catch(err => {
    console.log('Something went wrong')
    console.timeEnd('migration')
})
