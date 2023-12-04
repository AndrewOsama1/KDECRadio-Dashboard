import { toast } from '../toast/config.js'
import { sendMessage } from './chatApp.js'

const uploaders = document.querySelectorAll(".uploader-form")
const sizes = {
    "1mb": 1048576,
    "5mb": 5242880,
    "10mb": 10485760
}

uploaders.forEach(uploader => {
    let btn = uploader.querySelector('button')
    btn.addEventListener('click', async e => {
        let file = uploader.querySelector('input[type="file"]')
        if (file.files.length > 0)
            if (validateFile(file)) {
                let data = new FormData()
                data.append('file', file.files[0])
                let response = await fetch(`/api/en/storage/upload/${file.getAttribute('name')}`, {
                    method: 'POST',
                    body: data
                })
                if (response.status == 201){
                    let res = await response.json()
                    document.querySelector('.modal-wrapper.open').classList.remove("open")
                    document.body.classList.remove("modal-open")
                    sendMessage(res.results.url, file.getAttribute('name'), document.querySelector('.chat-room.active').getAttribute('room'))
                }
            }
            else toast('err-5001')
    })
})

const validateFile = file => {
    switch (file.getAttribute('name')) {
        case 'image':
            if (file.files[0].size <= sizes['1mb'])
                return true
            toast('err-5002')
            return false
        case 'video':
            if (file.files[0].size <= sizes['10mb'])
                return true
            toast('err-5003')
            return false
        case 'record':
            if (file.files[0].size <= sizes['5mb'])
                return true
            toast('err-5004')
            return false
        case 'document':
            if (file.files[0].size <= sizes['10mb'])
                return true
            toast('err-5005')
            return false
        default:
            toast('err-5006')
            return false
    }
}
