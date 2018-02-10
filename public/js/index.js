
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
socket.on('newMessage',function (message) {
    let li = jQuery("<li></li>");
    li.text(`${message.from} : ${message.text}`);
    jQuery('#messages-list').append(li);
});

socket.on('disconnect',function (){
    console.log("disconnected from the server.");
});

jQuery('#message-form').on('submit',function (e) {
    e.preventDefault();
    let messageObj = {
        from: "User",
        text:jQuery('#message').val()
    };
    socket.emit('createMessage',messageObj,function (data) {
        console.log(data + " - yay client got the ack.")
    });


});