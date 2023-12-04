const { createAlbum, getAlbumById } = require("../utils/albums.db")
const apiMessage = require("../utils/messages.api")
const { getSongsByAlbum, getAllSongs } = require("../utils/songs.db")
const storage = require("../utils/storage")


module.exports = {
    dashboard: {
        getOne: async (req, res) => {
            const { id } = req.params
            try {
                const album = await getAlbumById(id)
                const songs = await getAllSongs({ albumId: id })
                res.render('music', { album, songs })
            } catch (error) {
                console.error('Error fetching album data:', error)
                // You can handle the error case appropriately
                res.render('music', { album: null, songs: [] })
            }
        },
        add: async (req, res) => {
            const { albumName, categoryId } = req.body
            try {
                let imgPath = req.file.location
                await createAlbum({ albumName, imgPath, categoryId })
                res.cookie('event','msg-3000')
                res.redirect('/categories')
            } catch (error) {
                if (req.file) storage.remove([req.file.location])
                if (error.name === 'SequelizeUniqueConstraintError') res.cookie('event','err-3001')
                else res.cookie('event','err-3000')
                res.redirect('/categories')
            }
        },
        update: async (req, res) => {
            const { albumName } = req.body
            const { id } = req.params
            try {
                let album = await getAlbumById(id)
                let oldImgPath = album.imgPath
                if (albumName) album.albumName = albumName
                if (req.file) album.imgPath = req.file.location
                await album.save()
                if (req.file) await storage.remove([oldImgPath])
                res.cookie('event','msg-3001')
                res.redirect('/album/' + id)
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') res.cookie('event','err-3001')
                else res.cookie('event','err-3002')
                res.redirect('/album/' + id)
            }
        },
        remove: async (req, res) => {
            const { id } = req.params
            try {
                let songs = await getSongsByAlbum(id)
                let album = await getAlbumById(id)
                let path = album.imgPath
                if (songs.length > 0) {
                    let songPaths = []
                    for (const song of songs) {
                        songPaths.push(song.path)
                        await song.destroy()
                    }
                    await storage.remove(songPaths)
                }
                await album.destroy()
                await storage.remove([path])
                res.cookie('event','msg-3002')
                res.redirect('/categories')
            } catch (error) {
                res.cookie('event','err-3003')
                res.redirect('/categories')
            }
        }
    },
    api:{
        getOne: async (req, res) => {
            let { id } = req.params
            try {
                let album = await getAlbumById(id)
                if (!album) res.status(204).json({ message: apiMessage("album.notFound", req.language) })
                else res.status(200).json({ results: { album }})
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        getAlbumSongs: async (req, res) => {
            let { id } = req.params
            try {
                let album = await getAlbumById(id)
                if (!album) res.status(404).json({ message: apiMessage("album.notFound", req.language) })
                else {
                    let songs = await getSongsByAlbum(album.id)
                    if (!songs || songs.length == 0) res.status(204).json({ message: apiMessage("album.isEmpty", req.language) })
                    else res.status(200).json({ results: { songs, albumName: album.albumName }})
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        }
    }
}
