const express = require('express');
const socketIO = require('socket.io');

const path = require('path');
const http = require('http');

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
    console.log("a user was connected.");


    socket.on('createMessage',(email) =>{
        console.log('Message',email);
    });

    socket.emit('newMessage',{
        from:'John',
        text:'See you then',
        createdAt:new Date().getTime()
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