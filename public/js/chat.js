let socket = io();

function scrollToBottom(){
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');

    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight +
         lastMessageHeight >= scrollHeight){
            messages.scrollTop(scrollHeight);
        }
}

function parseQs(qs) {
    var items = qs.split('?')[1].split('&');
    data = {};
    items.forEach((item) => {
        let [ key, val ] = item.split('=');
        val = val.replace(/\+/g, '%20');
        data[key] = decodeURIComponent(val);
    });
    return data;
}

$(document).ready(function(){
    $('#message-form').on('submit', function(e){
        e.preventDefault();
        socket.emit('createMessage', {
            text: $('[name=message]').val()
        }, function(data){
            // callback
            $('#user').val("");
            $('[name=message]').val("");

            console.log(data.text);
        });
    });

    let locationBtn = $('#send-location');
    locationBtn.on('click', function(){
        if(!navigator.geolocation){
            return alert('Geolocation not supported by your browser');
        }
        locationBtn.attr('disabled', 'disabled').text('Sending Location...');
        navigator.geolocation.getCurrentPosition(function(position){
            // console.log(position);
            locationBtn.removeAttr('disabled').text('Send location');
            let { latitude, longitude } = position.coords;
            socket.emit('createLocationMsg', {
                latitude, longitude
            });
        }, function(err){
            locationBtn.removeAttr('disabled').text('Send location');
            alert('Unable to fetch location');
        });
    });
});

socket.on('connect', function(){
    console.log("Connected to Server");

    var params = parseQs(window.location.search);
    socket.emit('join', params, function(err){
        if(err){
            alert(err);
            window.location.href = '/';
        }else{
            console.log("No Error");
        }
    });
    
    
    let getFormattedTime_ = function(timestamp){
        date = new Date(timestamp);
        hour = date.getHours();
        date_ = (hour <= 12) ? {amOrPm: 'am', hour}:  
                {amOrPm: 'pm', hour: hour - 12};
        minutes = date.getMinutes();
        minutes_ = (minutes < 10) ? `${0}${minutes}` : minutes;
        return `${date_.hour}:${minutes_} ${date_.amOrPm}`;
    };

    socket.on('newMessage', function(msg){
        frTime = getFormattedTime_(msg.createdAt);
        var template = $('#message-template').html();
        var html = Mustache.render(template,{
            text: msg.text,
            from: msg.from,
            createdAt: frTime
        });
        $('#messages').append(html);
        scrollToBottom();
    });

    socket.on('updateUserList', function(users){
        var ol = $('<ol></ol>');
        users.forEach(function(user){
            ol.append(`<li>${user}</li>`);
        });
        $('#users').html(ol);
       
    });

    socket.on('newLocationMsg', function(data){
        var frTime = getFormattedTime_(data.createdAt);
        var template = $('#location-message-template').html();
        var html = Mustache.render(template,{
            lat : data.lat,
            long: data.long,
            text: data.text,
            from: data.from,
            createdAt: frTime,
            user: data.user
        });
        $('#messages').append(html);
                scrollToBottom();

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