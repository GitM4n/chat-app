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


const port = process.env.PORT ?? 3000;





io.on('connection', (client) => {
    console.log(`user connected ${client.handshake.auth.username}`);
    
    
    io.emit("user-status-online");
    
    client.on('private-room', ({sender_id, chat_id})=>{
        const room = [sender_id, chat_id].sort().join('-')
        client.join(room)
        console.log(`user connecterd in room ${room}`)
    })

    client.on('private-message', (data)=>{
        const roomName = [data.sender_id, data.chat_id].sort().join('-'); 
        io.to(roomName).emit('private-message', data); 
    })



    client.on('add-friend', ({sender_id, receiver_id})=>{
        const room = [sender_id, receiver_id].sort().join('-')
        client.to(room).emit('add-friend', sender_id)
        
    })



    

    client.on('disconnect', ()=>{
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
