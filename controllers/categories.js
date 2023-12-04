const { getAllAlbums, getAlbumsByCategory } = require("../utils/albums.db");
const { getAllCategories, createCategory, updateCategory, destroyCategory, getCategoryById } = require("../utils/categories.db");
const apiMessage = require("../utils/messages.api");
const { getSongsByCategory } = require("../utils/songs.db");
const storage = require("../utils/storage");

module.exports = {
    dashboard: {
        getAll: async (req, res) => {
            try {
                const response = await getAllCategories()
                const albums = await getAllAlbums()
                const categories = response.map(category => {
                    return {
                        id: category.id,
                        title: category.categoryTitle,
                        albums: albums.filter(album => album.categoryId === category.id)
                    }
                })
                res.render('categories', { categories })
            } catch (error) {
                console.error('Error fetching API data:', error);
                res.render('categories', { categories: [] });
            }
        },
        add: async (req, res) => {
            const { categoryTitle } = req.body
            try {
                await createCategory({ categoryTitle })
                res.cookie('event','msg-2000')
                res.redirect('/categories')
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') res.cookie('event','err-2001')
                else res.cookie('event','err-2000')
                res.redirect('/categories')
            }
        },
        update: async (req, res) => {
            const { categoryTitle } = req.body
            const { id } = req.params
            try {
                await updateCategory(categoryTitle, id)
                res.cookie('event','msg-2001')
                res.redirect('/categories')
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') res.cookie('event','err-2001')
                else res.cookie('event','err-2002')
                res.redirect('/categories')
            }
        },
        remove: async (req, res) => {
            const { id } = req.params
            try {
                let songs = await getSongsByCategory(id)
                let albums = await getAlbumsByCategory(id)
                if (songs.length > 0) {
                    let songPaths = []
                    for (const song of songs) {
                        songPaths.push(song.path)
                        await song.destroy()
                    }
                    await storage.remove(songPaths)
                }
                if (albums.length > 0) {
                    let albumCovers = []
                    for (const album of albums) {
                        albumCovers.push(album.imgPath)
                        await album.destroy()
                    }
                    await storage.remove(albumCovers)
                }
                await destroyCategory(id)
                res.cookie('event','msg-2002')
                res.redirect('/categories')
            } catch (error) {
                console.log(error);
                res.cookie('event','err-2003')
                res.redirect('/categories')
            }
        }
    },
    api:{
        getAll: async (req, res) => {
            try {
                let categories = await getAllCategories()
                if (!categories || categories.length == 0) res.status(204).json({ message: apiMessage("category.noCategories", req.language) })
                else res.status(200).json({ results: { categories }})
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        getCategoryAlbums: async (req, res) => {
            let { id } = req.params
            try {
                let category = await getCategoryById(id)
                if (!category) res.status(404).json({ message: apiMessage("category.notFound", req.language) })
                else {
                    let albums = await getAlbumsByCategory(category.id)
                    if (!albums || albums.length == 0) res.status(204).json({ message: apiMessage("category.isEmpty", req.language) })
                    else res.status(200).json({ results: { albums }})
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        }
    }
}