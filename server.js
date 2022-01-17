const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

io.on('connection', socket => {
    //Get the chatID of the user and join in a room of the same chatID
    chatID = socket.handshake.query.chatID
    socket.join(chatID)

    //Leave the room if the user closes the socket
    socket.on('disconnect', () => {
        socket.leave(chatID)
    })

    //Send message to only a particular user
    socket.on('send_message', message => {
        receiverChatID = message.receiverChatID
        senderChatID = message.senderChatID
        content = message.content

        //Send message to only that particular room
        socket.in(receiverChatID).emit('receive_message', {
            'content': content,
            'senderChatID': senderChatID,
            'receiverChatID':receiverChatID,
        })
    })
});

http.listen(process.env.PORT || 3000 )

// const express = require('express'); //requires express module
// const socket = require('socket.io'); //requires socket.io module
// const fs = require('fs');
// const app = express();
// var PORT = process.env.PORT || 3000;
// const server = app.listen(PORT); //tells to host server on localhost:3000


// //Playing variables:
// app.use(express.static('public')); //show static files in 'public' directory
// console.log('Server is running');
// const io = socket(server);

// var count = 0;


// //Socket.io Connection------------------
// io.on('connection', (socket) => {

//     console.log("New socket connection: " + socket.id)

//     socket.on('counter', () => {
//         count++;
//         console.log(count)
//         io.emit('counter', count);
//     })
// })