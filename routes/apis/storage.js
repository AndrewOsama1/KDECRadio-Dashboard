const { Router } = require("express")
const { uploadFile } = require("../../controllers/storage")
const { chatImagesUploader, chatVideosUploader, chatRecordsUploader, chatDocumentsUploader } = require("../../middlewares/fileUpload")

const storageRouter = Router()


storageRouter.post('/upload/image', chatImagesUploader.single('file'), uploadFile)
storageRouter.post('/upload/video', chatVideosUploader.single('file'), uploadFile)
storageRouter.post('/upload/record', chatRecordsUploader.single('file'), uploadFile)
storageRouter.post('/upload/document', chatDocumentsUploader.single('file'), uploadFile)

module.exports = storageRouter
