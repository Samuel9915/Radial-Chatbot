import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import {Socket} from 'socket.io'
import path from 'path'
const app = express()

let port = 5000
if (process.env.SOCKET_BRIDGE_PORT!=undefined) {
    port = parseInt(process.env.SOCKET_BRIDGE_PORT)
}
app.use(express.static(path.join(__dirname,'test_static')))
let http = require('http').Server(app)
let io = require('socket.io')(http)

io.on('connection',(socket:any)=>{
    console.log(`user connected ${socket.id} connected`)
    socket.on('test-signal',(payload:any)=>{
        console.log(`received`,payload)
        socket.emit('server-message',{received:payload,dt:new Date()})
    })

    socket.on('tg-signal',(payload:any)=>{
        socket.broadcast.emit('server-broadcast',{type:'tg-signal',payload:payload,dt:new Date()})
    })

    setInterval(()=>{
        socket.broadcast.emit('server-broadcast',{type:'ping',dt:new Date()})
    },5000)
})

const server = http.listen(port, ()=>{
    console.log(`listening to ${port}`)
})