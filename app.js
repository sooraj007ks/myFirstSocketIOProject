const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/public');
const express = require('express');

const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app); // For integrating with Socket.io
const io = socketIO(server);


const { isRealString } = require('./utils/validation');
const { generateMessage } = require('./utils/message');
const { Users } = require('./utils/users');

var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket)=>{
    console.log("New user connected");

    ////////////////////////////

    // socket.emit('newMessage', generateMessage(
    //     "Admin","Welcome to the Chat App"));

    // socket.broadcast.emit('newMessage', generateMessage(
    //     "Admin","New user joined"));

    socket.on('createMessage', (msg, callback)=>{
        console.log('createMessage', msg);
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        callback({
            text: `Hello ${msg.from}, your message sent successfully`
        });
    });
        
    ////////////////////////////////////////////////////////

    // GEO LOCATION
    socket.on('createLocationMsg', (coords)=>{
        data = generateMessage("Admin", "Location data");
        data.lat = coords.latitude;
        data.long = coords.longitude;
        io.emit('newLocationMsg', data);
        
    });
       

    ////////////////////////////////////////////////////////
    // Joining rooms
    socket.on('join',(params, callback) =>{
        if (!isRealString(params.name) && !isRealString(params.room)){
            return callback('Name and Room name are required');
        }
        var room = params.room;

        socket.join(room); // socket.leave -> to leave a group

        users.removeUser(socket.id); // remove from other rooms before joining new room.
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit('newMessage', generateMessage(
            "Admin","Welcome to the Chat App"));
    
        socket.broadcast.to(room).emit('newMessage', generateMessage(
            "Admin",`${params.name} has joined the group`));
            
        callback();
    });



    ////////////////////////////////////////////////////////
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
        var user = users.removeUser(socket.id);
        
        if (user){
            io.to(user.room).emit('updateUserList', 
                users.getUserList(user.room));

            io.to(user.room).emit('newMessage', 
                generateMessage("Admin", `${user.name} has left the room`));
        }

    });
});




server.listen(port, ()=> console.log(`Server started at ${port}`));
