const express = require('express');
const socketIO = require('socket.io');

const path = require('path');
const http = require('http');

const {generateMessage,generateLocationMessage} = require('../server/utils/message');
const {isRealString} = require('../server/utils/validation');

const app = express();
const PORT = process.env.PORT || 3000;

//http.createServer turns your computer to an http server ,
//passing the app instance(which is an http server instance that contains all the routes,and the listen on port 3000 we define on the app)
const server = http.createServer(app);

//this function returns a web socket server.
//with this function we attach the socket.io functionality with our express http server.
//this way we can accept sockets connections , and we got access the socket.io.js client library
//which is available in this path http://localhost:3000/socket.io/socket.io.js
const io= socketIO(server);


//with this function we are registering an event listener on predefined event called - 'connection'
//the event connection will trigger when a client connects to our server.
//then we pass a callback that receives the socket (that represent the connection between the client that connected and the server.)
//(there will be different socket for every client)
//notice that this socket is the same as the socket on the client (the client and the server communicate via this socket.)
io.on('connection',(socket) =>{
    //summary :

    //io.emit - emits to all connections that connected to the server.
    //socket.emit - emits to only to the user that opened a connection.
    //socket.broadcast.emit - sends a message to all the users expect the user that opened a connection.
    //socket.join(roomName) - makes the socket join the room.
    //socket.leave(roomName) - makes the socket leave the room.
    //io.to('groupName').emit - to all connections on that room
    //socket.broadcast.to('groupName').emit - to all connections on that room except the user that opened a connection.

    socket.on('join',(params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback("Name and room are required.");
        } else {
            //makes the socket join the room.
            socket.join(params.room);
            //passing to the client only.(the one that opened a connection/socket(connection = socket))
            socket.emit('newMessage',generateMessage("Admin","Welcome to the chat app."));
            //sends a message to all the users expect the one of the connection/socket in the room named -params.room
            socket.broadcast.to(params.room).emit('newMessage',generateMessage("Admin",`${params.name} Has joined the room.`));

            callback();
        }
    });

    //event listener on createMessage.
    //firing an ack cb after the listener finished exec
    socket.on('createMessage',(message,cb) =>{

        //when emitting an event from io (the web socket server) we emit the event to every open socket to this web socket server.(all the clients.)
        io.emit('newMessage',generateMessage(message.from,message.text));
        cb(`From Server : ${message.text} is ok.`);

    });

    socket.on('sendLocation',(location,cb) =>{
        io.emit('newLocationMessage',generateLocationMessage("Admin",location.latitude, location.longitude));
        cb(`From Server :the location has been sent.`)
    });

    socket.on('disconnect',() => {
        console.log("user was disconnected.");
    });

});




app.use(express.static(path.join(__dirname,'../public')));

//since we are working with the http server and not the app , we need to listen from http server obj.
server.listen(PORT,() =>{
    console.log(`listening on port ${PORT}...`)
});