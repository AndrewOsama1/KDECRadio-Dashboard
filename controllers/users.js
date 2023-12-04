const { literal, Op } = require("sequelize")
const { getAllUsersPaginated, findUserByUid, createUser, getAllUsers } = require("../utils/users.db")
const apiMessage = require("../utils/messages.api")
const { getNotificationsByUserId, addUserNotification } = require("../utils/userNotifications.db")
const { jsonToExcel } = require("../utils/xlsx")

module.exports = {
    dashboard: {
        getAll: async(req, res) => {
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
                                    { name: { [Op.like] : `${search}%` } },
                                    { name: { [Op.like] : `%${search}%` } },
                                    { name: { [Op.like] : `${search.split("")[0]}%` } }
                                ]
                            }, {
                                [Op.or] : [
                                    { email: { [Op.like] : `${search}%` } },
                                    { email: { [Op.like] : `%${search}%` } },
                                    { email: { [Op.like] : `${search.split("")[0]}%` } }
                                ]
                            }
                        ]
                    }
                    order = literal(`
                    CASE 
                        WHEN name LIKE '${search}%' THEN 1 
                        WHEN name LIKE '%${search}%' THEN 2 
                        WHEN email LIKE '${search}%' THEN 3 
                        WHEN email LIKE '%${search}%' THEN 4 
                        WHEN name LIKE '${search.split("")[0]}%' THEN 5 
                        WHEN email LIKE '${search.split("")[0]}%' THEN 6 
                    END`)
                }
                let pagination = { limit, page }
                let { count, rows } = await getAllUsersPaginated(where, pagination, order)
                res.render('users', { users: rows, total: count, page, limit, search })
            } catch (error) {
                console.error('Error fetching API data:', error)
                res.render('users', { users: [], total: 0, page: 1, limit, search })
            }
        },
        exportUsers: async (req, res) => {
            let { from, to, type } = req.query
            if (from && to){
                range = {
                    [Op.gte]: from,
                    [Op.lte]: to
                }
            }
            let order = ['id']
            let where = {}
            try {
                switch (type) {
                    case 'age': 
                        where.age = range
                        order[0] = 'age'
                    break
                    case 'date':
                        where.createdAt = range
                        order[0] = 'createdAt'
                    break
                    case 'all':
                        where = {}
                    break
                    default:
                        where.createdAt = range
                        order[0] = 'createdAt'
                }
                let users = await getAllUsers(where, order)
                if (!users){
                    res.cookie('event','err-6001')
                    res.redirect('/users')
                }
                else
                    if (users.length === 0){
                        res.cookie('event','err-6000')
                        res.redirect('/users')
                    }
                    else {
                        let file = new Buffer.from(jsonToExcel(users.map(user => user.dataValues)))
                        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
                        res.setHeader('Content-Disposition', `attachment; export-${ new Date().toISOString().split('T')[0] }.xlsx`)
                        res.status(201).send(file)
                    }
            } catch (error) {
                res.cookie('event','err-6001')
                res.redirect('/users')
            }
        }
    },
    api: {
        getOne: async (req, res) => {
            let { uid } = req.params
            try {
                let user = await findUserByUid(uid)
                if (!user) res.status(204).json({ message: apiMessage("user.notFound", req.language) })
                else res.status(200).json({ results: { user }})
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        remove: async (req, res) => {
            let { uid } = req.params
            try {
                let user = await findUserByUid(uid)
                if (!user) res.status(204).json({ message: apiMessage("user.notFound", req.language) })
                else
                    if (!(await user.destroy())) res.status(400).json({ message: apiMessage("user.couldntRemove", req.language) })
                    else res.status(200).json({ message: "removed successfully" })
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        add: async (req, res) => {
            let { uid, email, name, phone, age } = req.body
            try {
                if (!uid) res.status(400).json({ message: apiMessage("user.missingInputs", req.language) })
                else {
                    let data = {
                        uid,
                        email: email || 'anonymous',
                        name: name || 'anonymous',
                        phone: phone || 'anonymous',
                        age: age || 0
                    }
                    let user = await createUser(data)
                    if (!user) res.status(400).json({ message: apiMessage("user.couldntAdd", req.language) })
                    else res.status(201).json({ results: { user }})
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        update: async (req, res) => {
            let { email, name, phone, age } = req.body
            let { uid } = req.params
            try {
                if (!uid) res.status(400).json({ message: apiMessage("user.missingInputs", req.language) })
                else {
                    let user = await findUserByUid(uid)
                    if (!user) res.status(404).json({ message: apiMessage("user.notFound", req.language) })
                    else {
                        if (!email && !name && !phone && !age)
                            res.status(204).json({ message: apiMessage("user.noContent", req.language) })
                        else {
                            Object.keys(req.body).forEach(key=> user[key] && user.setDataValue(key, req.body[key]))
                            if (!(await user.save())) res.status(400).json({ message: apiMessage("user.couldntUpdate", req.language) })
                            else res.status(200).json({ results: { user }})
                        }
                    }
                }
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        getUserNotifications: async (req, res) => {
            let { uid } = req.params
            try {
                let user = await findUserByUid(uid)
                if (!user) res.status(404).json({ message: apiMessage("user.notFound", req.language) })
                else {
                    let notifications = await getNotificationsByUserId(user.id)
                    if (!notifications || notifications.length == 0) res.status(204).json({ message: apiMessage("notification.noNotifications", req.language) })
                    else res.status(200).json({ results: { notifications }})
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        },
        addUserNotification: async (req, res) => {
            let { uid, title, contnet } = req.params
            try {
                if (!uid) res.status(400).json({ message: apiMessage("notification.missingInputs", req.language) })
                else {
                    let user = await findUserByUid(uid)
                    if (!user) res.status(400).json({ message: apiMessage("user.couldntAdd", req.language) })
                    else {
                        let data = {
                            title,
                            contnet,
                            sendAt: Date.now(),
                            userId: user.id
                        }
                        let notification = await addUserNotification(data)
                        if (!notification) res.status(400).json({ message: apiMessage("notification.couldntAdd", req.language) })
                        else res.status(201).json({ results: { notification }})
                    }
                }
            } catch (error) {
                res.status(500).json({ message: apiMessage("server.internalError", req.language) })
            }
        }
    }
} 
