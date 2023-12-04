const { db } = require("../models/db.model")
const Notification = db.notifications

const notificationType = {
    title: String(''),
    body: String(''),
    sendAt: Date()
}
const paginationType = {
    limit: Number(),
    page: Number()
}

exports.getAllNotificationPaginated = async (where = {}, pagination = paginationType, order = []) => 
    await Notification.findAndCountAll({
        where,
        limit: pagination.limit,
        offset: (pagination.page > 0 ? pagination.page - 1 : 0) * pagination.limit,
        order
    })

exports.createNotification = async (notification = notificationType) => await Notification.create(notification)
