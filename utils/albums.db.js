const { db } = require("../models/db.model")
const Album = db.albums

const albumType = {
    albumName: String(''),
    imgPath: String(''),
    categoryId: Number()
}

exports.getAllAlbums = async (where = {}) => await Album.findAll({ where })

exports.getAlbumByName = async albumName => await Album.findOne({ where: { albumName }})

exports.getAlbumById = async (id = Number()) => 
    await Album.findOne({ 
        where: { id },
        include: [{
            model: db.categories,
            attributes: ['categoryTitle'],
            as: 'category'
        }]
    })

exports.createAlbum = async (album = albumType) => await Album.create(album)

exports.getAlbumsByCategory = async categoryId => await Album.findAll({ where: { categoryId }})
