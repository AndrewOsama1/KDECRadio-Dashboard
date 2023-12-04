const { db } = require("../models/db.model")
const Song = db.songs

const songType = {
    songName: String(''),
    author: String(''),
    path: String(''),
    lang: String(''),
    categoryId: Number(),
    albumId: Number(),
    views: Number()
}

const paginationType = {
    limit: Number(),
    page: Number()
}

exports.getAllSongs = async (where = {}) => await Song.findAll({ where })

exports.getSongById = async (id = Number()) => await Song.findOne({ where: { id }})

exports.getSongByName = async (songName = String('')) => await Song.findOne({ where: { songName }})

exports.createSong = async (song = songType) => await Song.create(song)

exports.getSongsByCategory = async categoryId => await Song.findAll({ where: { categoryId }})

exports.getSongsByAlbum = async albumId => await Song.findAll({ where: { albumId }})

exports.getAllSongsPaginated = async (where = {}, pagination = paginationType, order = []) => 
    await Song.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: (pagination.page > 0 ? pagination.page - 1 : 0) * pagination.limit,
        order
    })
