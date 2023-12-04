const multer = require('multer')
const multerS3 = require('multer-s3');
const storage = require('../utils/storage');

const provider = path => multer({
    storage: multerS3({
        s3: storage.client,
        bucket: storage.bucket,
        acl: storage.acl,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            const key = 'public/' + path + Date.now().toString() + file.originalname;
            cb(null, key)
        }
    })
})

exports.albumsUploader = provider('albums/')
exports.songsUploader = provider('songs/')

exports.chatImagesUploader = provider('chats/images/')
exports.chatVideosUploader = provider('chats/videos/')
exports.chatRecordsUploader = provider('chats/records/')
exports.chatDocumentsUploader = provider('chats/documents/')
