let socket = io();

$(document).ready(function(){
    $('#message-form').on('submit', function(e){
        e.preventDefault();
        socket.emit('createMessage', {
            from: $('#user').val(),
            text: $('[name=message]').val()
        }, function(data){
            console.log(data.text);
        });
    });
});

socket.on('connect', function(){
    console.log("Connected to Server");
    // socket.emit('createEmail', {
    //     from:"client@example.com",
    //     text:"Hello",
    //     createdAt: new Date()
    // });

    // socket.emit('createMessage', {
    //     from:"Frank",
    //     text:"hey there"
    // }, function(data){
    //     console.log('Got it ' + data.text);
    // });

    // socket.on('joined_', function(msg){
    //     console.log(msg);
    // });
    socket.on('newMessage', function(msg){
        $('#messages').append(`<li>${msg.from}: ${msg.text}</li>`);
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