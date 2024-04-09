const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
    }
});



require('dotenv').config();


const port = process.env.PORT || 3000;

const userSockets = {};



io.on('connection', (client) => {
    userSockets[client.handshake.auth.user_id] = client.id;
    console.log(userSockets);
    console.log(`user connected ${client.handshake.auth.username}`);


    io.emit("user-status-online");

    client.on('private-room', ({ chat_id }) => {
        client.join(chat_id)
        console.log(`user connecterd in room ${chat_id}`)
    })

    client.on('private-message', (data) => {
        io.to(data.chat_id).emit('private-message', data);
    })



    client.on('add-friend', ({ sender_id, sender_name, receiver_id }) => {
        const room = [sender_id, receiver_id].sort().join('-')
        client.join(room)
        client.to(userSockets[receiver_id]).emit('request-friend', sender_name)

    })

    client.on('accept-friend', ({ sender_id, receiver_id }) => {
        const room = [sender_id, receiver_id].sort().join('-')
        client.join(room)
        client.to(room).emit('accept-friend', sender_id)
    })

    client.on('reject-friend', ({ sender_id, receiver_id }) => {
        const room = [sender_id, receiver_id].sort().join('-')
        client.join(room)
        client.to(room).emit('reject-friend', sender_id)
    })





    client.on('disconnect', () => {
        console.log(`user disconnected ${client.id}`);

        io.emit("user-status-offline");

    })


})












app.get('/', (req, res) => {

    res.send('OK')
})

server.listen(port, () => {
    console.log(`listening on *:${port}`);

})