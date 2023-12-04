const { literal, Op } = require("sequelize")
const apiMessage = require("../utils/messages.api")
const { createSong, getSongById, getAllSongsPaginated } = require("../utils/songs.db")
const storage = require("../utils/storage")

module.exports = {
    dashboard: {
        add: async (req, res) => {
            const { songName, author, lang, albumId, categoryId } = req.body
            try {
                let path = req.file.location
                await createSong({ songName, author, path, lang, albumId, categoryId })
                res.cookie('event','msg-4000')
                res.redirect('/album/' + albumId)
            } catch (error) {
                if (req.file) storage.remove([req.file.location])
                if (error.name === 'SequelizeUniqueConstraintError') res.cookie('event','err-4001')
                else res.cookie('event','err-4000')
                res.redirect('/album/' + albumId)
            }
        },
        update: async (req, res) => {
            const { songName, author, lang, albumId } = req.body
            const { id } = req.params
            try {
                let song = await getSongById(id)
                let oldPath = song.path
                if (songName) song.songName = songName
                if (author) song.author = author
                if (lang) song.lang = lang
                if (req.file) song.path = req.file.location
                await song.save()
                if (req.file) await storage.remove([oldPath])
                res.cookie('event','msg-4001')
                res.redirect('/album/' + albumId)
            } catch (error) {
                if (req.file) storage.remove([req.file.location])
                if (error.name === 'SequelizeUniqueConstraintError') res.cookie('event','err-4001')
                else res.cookie('event','err-4002')
                res.redirect('/album/' + albumId)
            }
        },
        remove: async (req, res) => {
            const { albumId } = req.body
            const { id } = req.params
            try {
                let song = await getSongById(id)
                let path = song.path
                await song.destroy()
                await storage.remove([path])
                res.cookie('event','msg-4002')
                res.redirect('/album/' + albumId)
            } catch (error) {
                res.cookie('event','err-4003')
                res.redirect('/album/' + albumId)
            }
        }
    },
    api:{
        search: async (req, res) => {
            let { page, search, limit } = req.query
            let where = {}, order = [['createdAt', "ASC"]]
            let allowedLimit = [10, 25, 50]
            try {
                if (!page) page = 1
                if (!limit || allowedLimit.includes(limit)) limit = 10
                if (typeof page === 'string') page = parseInt(page)
                if (search) {
                    where = { 
                        [Op.or] : [
                            {
                                [Op.or] : [
                                    { "songName": { [Op.iLike] : `${search}%` } },
                                    { "songName": { [Op.iLike] : `%${search}%` } },
                                    { "songName": { [Op.iLike] : `${search.split("")[0]}%` } }
                                ]
                            }, {
                                [Op.or] : [
                                    { author: { [Op.iLike] : `${search}%` } },
                                    { author: { [Op.iLike] : `%${search}%` } },
                                    { author: { [Op.iLike] : `${search.split("")[0]}%` } }
                                ]
                            }
                        ]
                    }
                    order = literal(`
                    CASE 
                        WHEN "songName" LIKE '${search}%' THEN 1 
                        WHEN "songName" LIKE '%${search}%' THEN 2 
                        WHEN author LIKE '${search}%' THEN 3 
                        WHEN author LIKE '%${search}%' THEN 4 
                        WHEN "songName" LIKE '${search.split("")[0]}%' THEN 5 
                        WHEN author LIKE '${search.split("")[0]}%' THEN 6 
                    END`)
                }
                let pagination = { limit, page }
                let { count, rows } = await getAllSongsPaginated(where, pagination, order)
                if (!rows || rows.length == 0) res.status(404).json({ message: apiMessage("song.noSongs", req.language) })
                else res.status(200).json({
                    results: { songs: rows },
                    pagination: {
                        total: count,
                        page,
                        limit,
                        search
                    }
                })
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        view: async (req, res) => {
            let { id } = req.params
            try {
                let song = await getSongById(id)
                if (!song) res.status(404).json({ message: apiMessage("song.notFound", req.language) })
                else {
                    await song.increment('views')
                    res.status(202).json({ results: { song }})
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        }
    }
}
