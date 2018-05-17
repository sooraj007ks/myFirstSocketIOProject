let socket = io();

socket.on('connect', function(){
    console.log("Connected to Server");
    // socket.emit('createEmail', {
    //     from:"client@example.com",
    //     text:"Hello",
    //     createdAt: new Date()
    // });

    // socket.emit('newMsgFromClient', {
    //     from:"newmsg@gmail.com",
    //     text:"hey there"
    // });

    // socket.on('joined_', function(msg){
    //     console.log(msg);
    // });
    socket.on('newMessage', function(msg){
        console.log(msg);
    });

});

socket.on('disconnect', function(){
    console.log("Disconnected from server");
});

// socket.on('newEmail', function(emailData){
//     console.log("New email", emailData, emailData.from);
// });

socket.on('newMsg', function(msg){
    console.log("A new message received", msg);
});