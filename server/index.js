const { Server } = require("socket.io");
const express = require('express');
const http = require('http');


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });


require('dotenv').config();

const userSockets = {};

io.on('connection', (client) => {
    userSockets[client.handshake.auth.user_id] = client.id;
    console.log(`user connected ${client.handshake.auth.username}`);
    io.emit("user-status-online");

    client.on('private-room', ({ chat_id }) => {
        client.join(chat_id);
        console.log(`user connected in room ${chat_id}`);
    });

    client.on('private-message', (data) => {
        io.to(data.chat_id).emit('private-message', data);
    });

    client.on('add-friend', ({ sender_id, receiver_id, message }) => {
        client.to(userSockets[receiver_id]).emit('request-friend', sender_id, message);
    });

    client.on('accept-friend', ({ sender_id, receiver_id, message }) => {
        client.to(userSockets[receiver_id]).emit('accept-friend', sender_id, message);
    });

    client.on('reject-friend', ({ sender_id, receiver_id, message }) => {
        client.to(userSockets[receiver_id]).emit('reject-friend', sender_id, message);
    });

    client.on('disconnect', () => {
        console.log(`user disconnected ${client.id}`);
        io.emit("user-status-offline");
    });
});

server.listen(5000, ()=>{
    console.log('listening on *:5000');
})

module.exports = { app, server };