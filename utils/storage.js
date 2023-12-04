const { S3Client, DeleteObjectsCommand } = require('@aws-sdk/client-s3')

const storage = {
    bucket : process.env.S3_BUCKET_NAME,
    domain : process.env.S3_DOMAIN,
    acl: 'public-read',

    client: new S3Client({
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        },
        region: process.env.AWS_REGION
    }),

    remove: async keys => {
        let Objects = keys.map(key=> { 
            let Key = decodeURIComponent(key.split('amazonaws.com/')[1])
            return { Key }
        })
        await storage.client.send(new DeleteObjectsCommand({
            Bucket: storage.bucket,
            Delete: { Objects }
        }))
    }
}

module.exports = storage
