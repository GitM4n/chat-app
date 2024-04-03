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
    
    client.on('private-room', ({chat_id})=>{
        console.log(chat_id)
        client.join(chat_id)
        console.log(`user connecterd in room ${chat_id}`)
    })

    client.on('private-message', (data)=>{
        io.to(data.chat_id).emit('private-message', data); 
    })



    client.on('add-friend', ({sender_name, receiver_id})=>{
        const room = [sender_id, receiver_id].sort().join('-')
        client.join(room)
        client.to(room).emit('request-friend', sender_name)
        
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
