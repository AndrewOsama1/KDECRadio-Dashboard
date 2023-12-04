const admin = require('../utils/firebaseAdmin')
const { createNotification, getAllNotificationPaginated } = require('../utils/notification.db')

module.exports = {
    dashboard: {
        getAll: async (req, res) => {
            let { page } = req.query
            let where = {}, order = [['sendAt', "DESC"]]
            let limit = 25
            try {
                if (!page) page = 1
                if (typeof page === 'string') page = parseInt(page)
                let pagination = { limit, page }
                let { count, rows } = await getAllNotificationPaginated(where, pagination, order)
                res.render('notifications', { notifications: rows, total: count, page, limit })
            } catch (error) {
                console.error('Error fetching API data:', error)
                res.render('notifications', { notifications: [], total: 0, page: 1, limit })
            }
        },
        send: async (req, res) => {
            const { title, text } = req.body;
            // Construct the FCM payload
            const message = {
                notification: {
                    title,
                    body: text
                },
                token: process.env.FCM_TOKEN
            };
            if (req.body.token) message.token = req.body.token

            // Send the notification
            try {
                const response = await admin.messaging().send(message);
                await createNotification({ title, body: title, sendAt: new Date(Date.now()).toISOString() })
                res.status(200).send('Notification sent successfully.');
            } catch (error) {
                console.error('Error sending notification:', error);
                res.status(500).send('Failed to send notification.');
            }
        }
    }
}
