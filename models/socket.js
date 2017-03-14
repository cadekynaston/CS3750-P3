
module.exports = (io) => {
    var app = require('express');
    var router = app.Router();
    var userCount = 0;
    var rooms = [];
    // socket.io events
    io.on('connection', function (socket) {
        userCount++;
        console.log('a user connected ' + userCount + ' user(s)');
        socket.emit('message',{
            username: 'Chat It Up', 
            text: 'Welcome to Chat', 
        });
        socket.on('send', function (msg) {
            
            io.emit('message', { 
                username: msg.username, 
                text: msg.text, 
            });
        });
        socket.on('join', function (msg) {
            rooms.push(msg.room)
            socket.join(msg.room);
            io.in(msg.room).emit('message', {
                username: 'Game', 
                text: msg.username + ' has joined the game', 
            });
            console.log(room);
            console.log(rooms);
        });
        socket.on('leave', function (msg) {
            
            io.emit('message', {
                username: 'Game', 
                text: msg.username + ' has left Game', 
            });
        });
        socket.on('disconnect', function(){
            userCount--;
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    return router;
}