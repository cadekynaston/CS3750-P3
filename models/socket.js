
module.exports = (io) => {
    var app = require('express');
    var router = app.Router();
    var userCount = 0;
    var games = [];
    // socket.io events
    io.on('connection', function (socket) {
        userCount++;
        console.log('a user connected ' + userCount + ' user(s)');
        socket.emit('message',{
            username: 'Game', 
            text: 'Welcome to the Game', 
        });
        socket.on('leave', function (msg) {
            io.emit('message', {
                username: 'Game', 
                text: msg.username + ' has left Game', 
            });
        });
        socket.on('send', function (msg) {
            io.emit('message', { 
                username: msg.username, 
                text: msg.text, 
            });
        });
        socket.on('join', function (msg) {
            // search games for msg.gameCode
            let mygame = {
                room: msg.romm,
                hostName: msg.username,
                playerCount: 0,
                players: {
                    player0: msg.username,
                    
                },
                round: {
                    catigory: '',
                    playerQuestions: {
                        player0: '',

                    },
                    playerAnswers: {
                        player0: '',

                    }
                },
                playerPoints: {
                    player0: 0,
                },
                // Leader: Object.keys(playerPoints).reduce(function(a, b){
                //     return playerPoints[a] > playerPoints[b] ? a : b
                // })
            };
            // wont work till game exists
            // if game is found add player to game
            mygame.playerCount++;
            player = 'player' + mygame.playerCount;
            mygame.players[player] = msg.username; 
            mygame.playerPoints[player] = 0;
            mygame.round.playerAnswers[player] = 'Players answer';
            mygame.round.playerQuestions[player] = 'Playrs quetion';
        
            console.log(mygame);
            // join room game is in   
            socket.join(msg.room);
            // tell player that game is ready to join
            io.sockets.in(msg.room).emit('Join-game-approved');
            
        
            //if(mygame = games.find(msg.gameCode)){
                socket.join(msg.gameCode);
                io.sockets.in(msg.gameCode).emit('message', {
                    username: 'Game', 
                    text: msg.username + ' has joined the game', 
                });
                mygame.playerCount++;
                player = 'player' + mygame.playerCount;
                mygame.players[player] = msg.username; 
                mygame.playerPoints[player] = 0;
                mygame.round.playerAnswers[player] = 'Players answer';
                mygame.round.playerQuestions[player] = 'Playrs quetion';
            //}else
                socket.emit('game-exists', false);
            
        });
        socket.on('create', function (msg) {
            var game = {
                gameCode: msg.gameCode,
                numPlayers: msg.numPlayers,
                playerCount: 0,
                players: {
                    player0: msg.username,
                    
                },
                numRounds: msg.numRounds,
                round: {
                    catigory: {
                        
                    },
                    playerQuestions: {
                        player0: '',

                    },
                    playerAnswers: {
                        player0: '',

                    }
                },
                playerPoints: {
                    player0: 0,
                },
                // Leader: Object.keys(playerPoints).reduce(function(a, b){
                //     return playerPoints[a] > playerPoints[b] ? a : b
                // })
            }
            

            games.push(game)
            socket.join(msg.gameCode);
            io.sockets.in(msg.gameCode).emit('message', {
                username: 'Game', 
                text: msg.username + ' has joined the game', 
            });
            console.log(msg.gameCode);
            console.log(game);
        });
        
        socket.on('disconnect', function(){
            userCount--;
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    return router;
}