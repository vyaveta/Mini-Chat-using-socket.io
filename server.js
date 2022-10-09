// For keyboard shortcuts ;)
const log = console.log
// Now requiring essential modules :)
const http = require('http')
const path = require('path')
const express = require('express')
const socketio = require('socket.io')
const formatMessages = require('./utils/messages')
const { userJoin , getCurrentUser , userLeave , getRoomUsers } = require('./utils/users')
const botname = 'Mini Chat Bot'
// Declaring and Inititalizing variables
const app  = express()
const server = http.createServer(app)
const io = socketio(server) // Make sure that you must Initialize this variable only after initializing app and server!

// Code to run socket io when client connects
io.on('connection', socket => {
    log('new ws connection!')
    socket.on('joinRoom', ({ username , room }) => {
        const user = userJoin( socket.id ,  username , room)
        log(user,'from the server')
        socket.emit('message' , formatMessages(botname,'Welcome to Mini Web Chat!')) // This will only notify the user that has connected NOTICE!! - this will only send message to the connected user,so it is used to welcome the user with a welcome message ! :)
        socket.join(user.room)
        // This will notify everyBody else expect that user , since we dont want to notify the user that he/she has connected!  // io.emit() =>This code will notify or send message to everyone including the user 
        socket.broadcast.to(user.room).emit( 'message' , formatMessages ( `${user.username}`,'joined the chat!' )) 
        // Show the users list and the room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })
    // Listen on chat message
    socket.on('chatMessage' , (msg) => {
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message', formatMessages ( user.username , msg ))
        log(msg)
    })
    socket.on('disconnect' , () => {
        const user = userLeave(socket.id)
        if(user) {
            io.to(user.room).emit('message' , formatMessages ( botname , `${user.username} has left the chat!` ))
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
    })
})
// Now setting Static folder 
app.use(express.static(path.join(__dirname,'public')))

const PORT = 7000 || process.env.PORT

server.listen(PORT, () => log(`the server is runninng on port http:localhost://${PORT}`))