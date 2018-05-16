const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/public');
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); // For integrating with Socket.io
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New user connected");

    // socket.emit('newEmail', {
    //     from:"mike@example.com",
    //     text:"Hello",
    //     createdAt: new Date()
    // });

    socket.emit('newMsg', {
        from:"testmsg@example.com",
        text:"Hello, This is new msg from server",
        createsAt: new Date()
    });

    socket.on('newMsgFromClient', (msg)=>{
        console.log("New msg created by client", msg);
    });

    // socket.on('createEmail', (newEmail)=>{
    //     console.log('createEmail', newEmail);
    // });

    socket.on('disconnect', ()=>{
        console.log("Client Disconnected");
    });
});




server.listen(port, ()=> console.log(`Server started at ${port}`));
