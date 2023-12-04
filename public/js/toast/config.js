import { errors } from './errors.js'
import { messages } from './messages.js'

const getTag = ()=> {
    var cookieArray = decodeURIComponent(document.cookie).split(';')
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i]
        while (cookie.charAt(0) == ' ')
            cookie = cookie.substring(1)
        if (cookie.indexOf("event=") == 0)
            return cookie.substring(6, cookie.length)
    }
    return ""
}
const clearTag = ()=>
    document.cookie = "event=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"

const toast = (tag = getTag())=> {
    if (tag){
        let events = tag.split('-')[0] == 'err' ? errors : messages
        let event
        if (events[tag]) event = events[tag]
        else event = events['err-zzzz']
        let toastCard = document.createElement('div')
        let toastCloser = document.createElement('img')
        let toastMessage = document.createElement('h3')
        toastMessage.innerText = event
        toastCloser.src = '/images/icons/close.png'
        toastMessage.classList.add('toast-message')
        toastCloser.classList.add('toast-closer')
        toastCard.classList.add('toast-card')
        toastCard.classList.add(tag.split('-')[0] == 'err' ? 'error' : 'message')
        toastCloser.addEventListener('click', e => toastCard.remove())
        toastCard.addEventListener('click', e => toastCard.remove())
        toastCard.appendChild(toastCloser)
        toastCard.appendChild(toastMessage)
        document.body.appendChild(toastCard)
        setTimeout(() => toastCard.remove(), 6300)
        clearTag()
    }
}

toast()

export { toast }
