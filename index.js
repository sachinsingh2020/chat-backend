const http = require('http');
const express = require('express');
const cors = require('cors')
const socketIO = require('socket.io')

const app = express()
const port = 4500 || process.env.PORT

let users = [];

// app.use(cors({
//     origin: 'https://cchat-livid.vercel.app/',
//     // credentials: true,
//     // methods: ['GET', 'POST', 'PUT', 'DELETE'],
// }));
app.use(cors())

app.get("/", (req, res) => {
    res.send('Hell It\'s Working')
})

const server = http.createServer(app)

const io = socketIO(server)

io.on("connection", (socket) => {
    console.log("new connection")

    socket.on('joined', (data) => {
        users[socket.id] = data.user
        console.log(`${data.user} has Joined`)
        socket.broadcast.emit('userJoined', { user: "Admin", message: `${users[socket.id]} has Joined` })
        socket.emit('welcome', { user: "Admin", message: `Welcome to the Chat,${users[socket.id]}` })
    })

    socket.on("message", ({ message, id }) => {
        io.emit('sendMessage', { user: users[id], message, id })
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit('leave', { user: 'Admin', message: `${users[socket.id]} has left` })
        console.log("user left")
    })




})

server.listen(port, () => {
    console.log(`server is working on http://localhost:${port}`)
})

