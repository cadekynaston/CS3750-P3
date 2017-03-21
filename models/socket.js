
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
            io.sockets.in(msg.gameCode).emit('message', { 
                username: msg.username, 
                text: msg.text, 
            });
        });
        // this function is called only by the game page
        // it add a player to a room if the room dose not
        // exists it calls no game and returns to home page
        socket.on('connect-to-game-room', function(msg) {
            console.log('connect to Game', msg);
            //check to see of game exists
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                // if game exists join room with gameCode
                socket.join(msg.gameCode);
                // tell game somone joined the game (not implimented yet)
                io.sockets.in(msg.gameCode).emit('join-game');
            }else{
                console.log('no game');
                // tell game bage there is no game
                socket.emit('no-game');
            }
        });
        // this function is called my the join game page 
        // it add a player to ghe game if the game exists
        socket.on('join-game-room', function (msg) {
            // test for if game with gameCode exists
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            console.log('join game room', msg , test, '\nGame: ', game);
            if(test){
                // find the index of the game with gameCode
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                // add new player to the game 
                games[dex].playerCount++
                player = 'player' + games[dex].playerCount;
                games[dex].players[player] = msg.username; 
                games[dex].playerPoints[player] = 0;
                games[dex].round.playerAnswers[player] = 'Players answer';
                games[dex].round.playerQuestions[player] = 'Playrs quetion';
                console.log(games);
            }else{
                console.log('no game');
                socket.emit('no-game');
            }
        });
        // this function is called by the create game page
        socket.on('create', function (msg) {
            console.log('Create Game');
            // we may need to make sure a game with gameCode dose not exists before creating a new game with that gameCode
            // make a new game model 
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
                // calculate that player with the highest points (we may not want to do this here)
                // Leader: Object.keys(playerPoints).reduce(function(a, b){
                //     return playerPoints[a] > playerPoints[b] ? a : b
                // })
            }
            // add game to the active games array
            games.push(game)
            // this is not needed 
            // socket.join(msg.gameCode);
            // io.sockets.in(msg.gameCode).emit('message', {
            //     username: 'Game', 
            //     text: msg.username + ' has joined the game', 
            // });
            // console.log(msg.gameCode);
            console.log(games);
        });
        
        socket.on('disconnect', function(){
            userCount--;
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    return router;
}