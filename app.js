const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/public');
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); // For integrating with Socket.io
const io = socketIO(server);

const { generateMessage } = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New user connected");

    ////////////////////////////

    socket.emit('newMessage', generateMessage(
        "Admin","Welcome to the Chat App"));

    socket.broadcast.emit('newMessage', generateMessage(
        "Admin","New user joined"));

    socket.on('createMessage', (msg)=>{
        console.log('createMessage', msg);
        io.emit('newMessage', generateMessage(msg.from, msg.text));
    });
        
    ////////////////////////////


    // socket.emit('newEmail', {
    //     from:"mike@example.com",
    //     text:"Hello",
    //     createdAt: new Date()
    // });

    // socket.emit('newMsg', {
    //     from:"testmsg@example.com",
    //     text:"Hello, This is new msg from server",
    //     createsAt: new Date()
    // });

        // io.emit for broadcasting a message
    

    // socket.on('newMsgFromClient', (msg)=>{
    //     msg.createdAt = new Date().getTime();
        // console.log("New msg created by client", msg);
        // io.emit('newMsg', {
        //     from:"newmsg@gmail.com",
        //     text:"hey there",
        //     createdAt: new Date().getTime()
        // });
        
    // });
    
    // BROADCASTING
    // socket.on('join_', (msg)=>{
    //     console.log(msg);
    //     socket.broadcast.emit('joined_', {text: `${msg.name} joined to chat`});
    //     socket.emit('joined_self', {text: `Hello ${msg.name}`});
    // });

    // socket.on('createEmail', (newEmail)=>{
    //     console.log('createEmail', newEmail);
    // });

    socket.on('disconnect', ()=>{
        console.log("Client Disconnected");
    });
});




server.listen(port, ()=> console.log(`Server started at ${port}`));
