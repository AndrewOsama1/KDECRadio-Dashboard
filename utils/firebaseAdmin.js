const admin = require('firebase-admin');
const serviceAccount = require('../churchapp-3e0d9-firebase-adminsdk-q62ep-2eef80014e.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
})

module.exports = admin;
