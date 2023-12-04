const { db } = require("../models/db.model")
const UserNotification = db.userNotifications

const userNotificationType = {
    title: String(''),
    content: String(''),
    sendAt: Date.now(),
    userId: Number()
}

exports.getNotificationsByUserId = async (userId = Number()) =>
    await UserNotification.findAll({ where: { userId }})

exports.addUserNotification = async (notification = userNotificationType) =>
    await UserNotification.create(notification)
