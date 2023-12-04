const db = firebase.database()
const roomsTable = db.ref('rooms')
const messagesTable = db.ref('messages')

const app = document.querySelector('[chat-app]')
const roomsContainer = app.querySelector('.rooms')
const messagesContainer = app.querySelector('.messages')
const sendForm = app.querySelector('.sendForm')
const mobileRoomHead = app.querySelector('.mobile-room-head')

const formMessage = sendForm.querySelector('.messageInput')
const formSubmit = sendForm.querySelector('.messageSubmit')
const formRoom = sendForm.querySelector('[room-input]')
let roomToken

/** user info */
const userSession = {
    username: 'Admin'
}

const getDate = t => {
    const d = new Date(t)
    const dd = String(d.getDate()).padStart(2, '0')
    const mo = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    const ho = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const half = ho < 12 ? 'AM' : 'PM'
    const hh = ho % 12 || 12
    return `${dd}-${mo}-${yyyy} ${hh}:${mm} ${half}`
}

const MessageComponent = message => {
    if (message.content) {
        if (messagesContainer.querySelector('.empty-message')) messagesContainer.querySelector('.empty-message').remove()
        let messageElement, messageContent, messageDate, dir
        switch (message.type) {
            case 'default':
                messageElement = document.createElement('div')
                messageContent = document.createElement('h2')
                messageDate = document.createElement('h5')
                dir = message.from === 'Admin' ? 'left' : 'right'
                messageContent.textContent = message.content
                messageElement.classList.add('chat-message')
                messageElement.classList.add(dir)
                messageDate.textContent = getDate(message.date)
                messageElement.append(messageDate)
                messageElement.append(messageContent)
                return messageElement
            case 'image':
                messageElement = document.createElement('div')
                messageContent = document.createElement("img")
                messageDate = document.createElement('h5')
                dir = message.from === 'Admin' ? 'left' : 'right'
                messageContent.src = message.content
                messageElement.classList.add('chat-message')
                messageElement.classList.add('chat-image')
                messageElement.classList.add(dir)
                messageDate.textContent = getDate(message.date)
                messageElement.append(messageDate)
                messageElement.append(messageContent)
                return messageElement
            case 'video':
                messageElement = document.createElement('div')
                messageContent = document.createElement("video")
                messageDate = document.createElement('h5')
                dir = message.from === 'Admin' ? 'left' : 'right'
                messageContent.src = message.content
                messageContent.controls = true
                messageElement.classList.add('chat-message')
                messageElement.classList.add('chat-video')
                messageElement.classList.add(dir)
                messageDate.textContent = getDate(message.date)
                messageElement.append(messageDate)
                messageElement.append(messageContent)
                return messageElement
            case 'record':
                messageElement = document.createElement('div')
                messageContent = document.createElement("audio")
                messageDate = document.createElement('h5')
                dir = message.from === 'Admin' ? 'left' : 'right'
                messageContent.src = message.content
                messageContent.controls = true
                messageElement.classList.add('chat-message')
                messageElement.classList.add('chat-audio')
                messageElement.classList.add(dir)
                messageDate.textContent = getDate(message.date)
                messageElement.append(messageDate)
                messageElement.append(messageContent)
                return messageElement
        }
    } else {
        return ''
    }
}

const RoomComponent = room => {
    const roomElement = document.createElement('div')
    const name = document.createElement('h2')
    const border = document.createElement('div')
    const overlay = document.createElement('div')
    border.classList.add('chat-room-border')
    overlay.classList.add('chat-room-selected')
    name.textContent = room.user
    roomElement.classList.add('chat-room')
    if (room.unSeen)
        /** unseen flag mean that reciever did not yet saw the message */
        messagesTable.orderByChild('roomId').equalTo(room.roomId).limitToLast(1).once('value').then(data => {
            /** check if last message (unread message) sender is the same user */
            const message = Object.values(data.val())[0]
            /** if current is not the sender then mark this room as having new message room */
            if (message.from !== userSession.username) roomElement.classList.add('new-message')
        })
    roomElement.setAttribute('room', room.roomId)
    roomElement.setAttribute('token', room.token)
    roomElement.onclick = () => openRoom(room.roomId)
    roomElement.append(name)
    roomElement.append(border)
    roomElement.append(overlay)
    return roomElement
}

const EmptyComponent = () => {
    const message = document.createElement('h2')
    message.textContent = "there is nothing here yet!"
    message.classList.add('empty-message')
    return message
}

const updateMessagesContainer = full => {
    if (full) messagesContainer.innerHTML = ''
    const roomId = roomsContainer.querySelector('.chat-room.active').getAttribute('room')
    messagesTable.orderByChild('roomId').equalTo(roomId).once('value').then(data => {
        if (data.val()) {
            const messages = Object.values(data.val())
            if (messages.length > 0)
                for (const message of messages)
                    messagesContainer.append(MessageComponent(message))
            else messagesContainer.append(EmptyComponent())
        } else messagesContainer.append(EmptyComponent())
        setTimeout(()=>{
            messagesContainer.scroll({ behavior: 'smooth', top: messagesContainer.scrollHeight })
        }, 500)
    })
}

const dbUpdateRoom = (roomId, options = { lastSeen: true, unSeen: false }) => {
    /** update room last seen to now */
    roomsTable.orderByChild('roomId').equalTo(roomId).once('value').then(data => {
        if (data.val()) {
            const id = Object.keys(data.val())[0]
            let updateData = {}
            if (options.lastSeen) updateData.lastSeen = Date.now()
            if (options.unSeen != undefined) updateData.unSeen = options.unSeen
            db.ref(`rooms/${id}`).update(updateData)
        }
    })
}

const openRoom = roomId => {
    /** replace current active room with selected room */
    roomsContainer.querySelector('.chat-room.active').classList.remove('active')
    const newActiveRoom = roomsContainer.querySelector(`[room="${roomId}"]`)
    newActiveRoom.classList.add('active')

    /** if room have new unseen message class remove it on open (not sent by you) */
    if (newActiveRoom.classList.contains('new-message')) dbUpdateRoom(roomId, { lastSeen: false, unSeen: false })
    else dbUpdateRoom(roomId, { lastSeen: false })
    messagesContainer.classList.add('open')
    sendForm.classList.add('open')
    mobileRoomHead.classList.add('open')
    mobileRoomHead.querySelector('h3').textContent = newActiveRoom.querySelector('h2').textContent
    roomsContainer.classList.remove('open')
    updateMessagesContainer(true)
}

mobileRoomHead.querySelector('button').onclick = () => {
    messagesContainer.classList.remove('open')
    sendForm.classList.remove('open')
    mobileRoomHead.classList.remove('open')
    roomsContainer.classList.add('open')
}

let firstTime = true
roomsTable.on('value', data => {
    if (Object.keys(data).length > 1) {
        // array of rooms
        let rooms = Object.values(data.val()).reverse()
        let activeRoomId
        rooms = rooms.sort((a, b) => b.lastSeen - a.lastSeen)
        if (!firstTime) activeRoomId = roomsContainer.querySelector('.chat-room.active').getAttribute('room')
        roomsContainer.innerHTML = ''
        for (const room of rooms)
            if (room.user && room.user !== 'anonymous')
                roomsContainer.append(RoomComponent(room))
        if (firstTime) {
            roomsContainer.firstElementChild.classList.add('active')
            updateMessagesContainer(true)
            firstTime = false
        } else roomsContainer.querySelector(`.chat-room[room="${activeRoomId}"]`).classList.add('active')
    } else {
        roomsContainer.innerHTML = ''
        if (room.user && room.user !== 'anonymous')
            roomsContainer.append(RoomComponent(data.val()))
        if (firstTime) {
            roomsContainer.firstElementChild.classList.add('active')
            updateMessagesContainer(true)
            firstTime = false
        }
    }
})

let firstMessage = true
messagesTable.limitToLast(1).on('child_added', data => {
    if (firstMessage) firstMessage = false
    else {
        const message = data.val()
        let selectedRoom = roomsContainer.querySelector(`.chat-room[room="${message.roomId}"]`)
        if (selectedRoom.classList.contains('active')) messagesContainer.append(MessageComponent(message))
        else dbUpdateRoom(message.roomId, { lastSeen: true, unSeen: true })
    }
})

formMessage.onkeypress = event => {
    if (event.key == "Enter") {
        formRoom.value = roomsContainer.querySelector('.chat-room.active').getAttribute('room')
        /** add input validation */
        sendMessage()
    }
}

formSubmit.onclick = () => {
    formRoom.value = roomsContainer.querySelector('.chat-room.active').getAttribute('room')
    roomToken = roomsContainer.querySelector('.chat-room.active').getAttribute('token')
    /** add input validation */
    sendMessage()
}

const sendMessage = (content = '', type = 'default', roomId = '') => {
    if (!content) content = formMessage.value
    if (!roomId) roomId = formRoom.value
    const message = {
        content,
        date: Date.now(),
        from: userSession.username,
        roomId,
        seen: false,
        type
    }
    messagesTable.push(message)
    formRoom.value = ''
    formMessage.value = ''
    sendNotification('New Message', 'click to see message', roomToken)
    dbUpdateRoom(roomId, { lastSeen: true })
}

const sendNotification = (title, body, token) => {
    let data = { title, body, token }
    fetch('/send-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then()
}

export { sendMessage }
