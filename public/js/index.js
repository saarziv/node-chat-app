
// this function creates the socket to the server
// this socket will be the way the client and the server will communicate.
let socket = io();

//if suddenly the server shuts down the client will still try to keep this socket online and will keep sending req to the server.
//(visible in network tab of dev tools.)
//these to event listeners will fire when we connect / disconnect from the server.
//notice that im not using arrow functions on the client, because only chrome supports es6 (it will only work on chrome..)
socket.on('connect',function () {
    console.log("connected to the server.");
});

//registers and event listener on newMessage
socket.on('newMessage',function (message) {
    let li = jQuery("<li></li>");
    li.text(`${message.from} : ${message.text}`);
    jQuery('#messages-list').append(li);
});

socket.on('disconnect',function (){
    console.log("disconnected from the server.");
});

jQuery('#message-form').on('submit',function (e) {

    //default of jquery when the event of submit triggers, adds to the url a query parameter , this way we prevent it.
    e.preventDefault();
    let messageObj = {
        from: "User",
        text:jQuery('#message').val()
    };

    //emits an event createMessage passing the input data from the user.
    //getting an ack callback saying that the data has been passed successfully and logging it to the console.
    socket.emit('createMessage',messageObj,function (data) {
        console.log(data + " - yay client got the ack.")
    });
});

let locationBtn = jQuery('#sendLocationBtn');
locationBtn.on('click',function (e) {

    //checks if the geolocation api works..(its supported by most browsers. no need to import some library)
    if(!navigator.geolocation){
        alert('geolocation does not work.')
    } else {
        navigator.geolocation.getCurrentPosition(function (position) {

            //emits an event called sendLocation ,with object that contains lat,lng
            //getting a cb here as well.
            socket.emit('sendLocation',{
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },function (data) {
                console.log(data + " - client got the ack.")
            });

        });
    }
});