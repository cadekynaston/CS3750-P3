var schema = require('../models/schema');

module.exports = (io) => {
    var app = require('express');
    var router = app.Router();
    var userCount = 0;// total number of players in all of the games
    var games = [];// array of games
    // socket.io events
    io.on('connection', function (socket) {
        userCount++;
        console.log('a user connected ' + userCount + ' user(s)');

        // this funciton will only send to the connecting player
        socket.emit('message',{
            username: 'Game',
            text: 'Welcome to the Game',
        });

        // chat style message that indicates when someone has navigated away
        // this fuction is called by a client fuction that looks like:
        // window.onbeforeunload = () => {
        //     socket.emit('leave',{
        //         username: document.getElementById('username').textContent,
        //         gameCode: document.getElementById('gameCode').textContent
        //     })
        // };
        socket.on('leave', function (msg) {
            io.sockets.in(msg.gameCode).emit('message', {
                username: 'Game',
                text: msg.username + ' has left Game',
            });
        });

        // chat style function for sending and reciving messages
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
            //check to see of game exists
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                // if game exists join room with gameCode
                socket.join(games[dex].gameCode);
                // tell game somone joined the game (not implimented yet)
                socket.emit('client-gameStart', games[dex]);
                console.log('connect to Game', games[dex]);
            }else{
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });


        // this function is called my the join game page
        // it add a player to ghe game if the game exists
        socket.on('join-game-room', function (msg) {
            // test for if game with gameCode exists
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                // find the index of the game with gameCode
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                //check to see if player already exists
                Object.entries(games[dex].players).forEach(([key, value])=> {
                    if(msg.username == value){
                        console.log('user already exists joining game', games[dex].players)
                    }else{
                        if(games[dex].playerCount < games[dex].numPlayers){
                            // add new player to the game
                            player = 'player' + games[dex].playerCount;
                            games[dex].players[player] = msg.username;
                            games[dex].playerPoints[player] = 0;
                            games[dex].playerCount++
                            console.log('join game room', games[dex]);
                        }else{
                            console.log('game is full', games[dex]);
                            socket.emit('redirect', '/join');
                        }
                            
                    }
                });

                
            }else{
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });

        // this will gets game catigories from mongo for create game page
        socket.on('server-getCategories',function(){
            schema.Questions.find().distinct('category', function(err, category){
                console.log(category);
                socket.emit('client-getCategories', category);
            })
        });

        // this function is called by the create game page
        socket.on('create', function (game) {
            // we may need to make sure a game with gameCode dose not exists before creating a new game with that gameCode
            let gameExists = games.filter(function(e) { return e.gameCode == game.gameCode; }).length > 0;
            
            // add game to the active games array
            if(!gameExists){
                games.push(game)
                console.log('Create Game', game);
            }else{
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                
                // what should we tell the user if game already exists
                console.log('game already exists', games[dex])
                socket.emit('join-game-room', {
                    gameCode: game.gameCode,
                    username: game.players['player0']
                })
            }

            console.log(games);
        });

        // this will get the server side game
        socket.on('server-getGame',function(game){
            let test = games.filter(function(e) { return e.gameCode == game.gameCode; }).length > 0;
            if(test){
                // find the index of the game with gameCode
                let dex = games.findIndex(function(e) { return e.gameCode == game.gameCode; });
                // send updated game object to all players in the game (not yet implimented)
                console.log(games[dex]);
                socket.emit('client-getGame',games[dex]);
            }else{
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }

        });

        socket.on('server-getGameCategories',function(msg){
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                console.log(' getGameCategories ',games[dex].categories);
                socket.emit('client-newRound', games[dex].categories);
            }else{
               io.sockets.in(msg.gameCode).emit('message', {
                    username: 'Game Server',
                    text: 'Cant find Game',
                });
                socket.emit('redirect', '/');
            }
        });

        socket.on('server-allPlayersIn', function(msg){
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
            io.sockets.in(msg.gameCode).emit('client-allPlayersIn', games[dex])
        });

        socket.on('server-createRound', function(round){
            let test = games.filter(function(e) { return e.gameCode == round.gameCode; }).length > 0;
            if(test){
                // // round object makde in _game.js
                // let round = {
                //     gameCode: gameInfo.gameCode,
                //     Category: '',
                //     Question: '',
                //     liesIn: 0,
                //     playerLies: {},
                //     answersIn: 0,
                //     playerAnswers: {}
                // }

                // find the index of the game with gameCode
                let dex = games.findIndex(function(e) { return e.gameCode == round.gameCode; });
                // add Question and Answer to round
                schema.Questions.find({category: round.Category}, function(err, questions){
                    if(!questions){
                        console.log('could not find a question');
                    }else{
                        console.log(questions);
                        let rand = Math.floor(Math.random() * (questions.length));
                        console.log(questions[rand]);
                        
                        round.Question= questions[rand].question;
                        round.playerLies['Answer'] = questions[rand].answer;

                        //addPlayers to round
                        for(i=0;games[dex].playerCount>i;i++){
                            var player = 'player' + i;
                            round.playerLies[player] = '';
                            round.playerAnswers[player] = '';
                        }
                            
                        // add new round to game
                        
                        games[dex].round.push(round);
                        // send updated game object to all players in the game (not yet implimented)
                        io.sockets.in(round.gameCode).emit('client-startRound', games[dex].round[games[dex].roundCount]);
                        // add timer here if there is time
                        console.log('round added to game', round);
                    }
                });

            }else{
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });
//
//      collect lies from the players 
//
        socket.on('server-updateRoundLies', function(msg){
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                Object.entries(games[dex].players).forEach(([key, value])=> {
                    if(msg.username == value){
                        games[dex].round[games[dex].roundCount].liesIn++;
                        games[dex].round[games[dex].roundCount].playerLies[key] = msg.lie;
                    }
                });
                console.log(games[dex].round[games[dex].roundCount]);

                // if all players are in, move to next part of round else show answering player wait screen
                if(games[dex].playerCount == games[dex].round[games[dex].roundCount].liesIn){
                    io.sockets.in(msg.gameCode).emit('client-selectionRound', games[dex].round[games[dex].roundCount]);
                }else{
                    socket.emit('wait', {text: 'waiting for all players to send there lies'});
                }
            }else{
               io.sockets.in(msg.gameCode).emit('message', {
                    username: 'Game Server',
                    text: 'Cant find Game',
                });
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });
//
//      collect all the answers as they come in give out points
//
        socket.on('server-getRoundAnswers', function(msg){
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                Object.entries(games[dex].players).forEach(([key, value])=> {
                    if(msg.username == value){
                        games[dex].round[games[dex].roundCount].answersIn++;
                        games[dex].round[games[dex].roundCount].playerAnswers[key] = msg.answer;
                    }
                });
                console.log('getRoundAnswers', games[dex]);
                // give player that wrote the question you selected playerPoints
                Object.entries(games[dex].round[games[dex].roundCount].playerAnswers).forEach(([key, value])=>{
                    console.log('add points \n', key, value, msg.mykey, msg.answer);
                    if(value == msg.answer){
                        console.log('add points \n', key, value, msg.mykey, msg.answer);
                        if(key == 'Answer'){
                            console.log('Answer == Key')
                            // give yourself 200 points for getting the correct answer
                            games[dex].playerPoints[msg.mykey] += 200;
                        }else{
                            // give someone else 100 points for selecing there lie
                            games[dex].playerPoints[key] += 100
                        }
                    }
                });

                // if all players are in, move to next part of round else show answering player wait screen
                if(games[dex].playerCount == games[dex].round[games[dex].roundCount].answersIn){
                    console.log('end Round');
                    io.sockets.in(msg.gameCode).emit('client-getScores', games[dex]);
                }else{
                    socket.emit('wait', {text: 'waiting for all players to send there Answers'});
                }
            }else{
               io.sockets.in(msg.gameCode).emit('message', {
                    username: 'Game Server',
                    text: 'Cant find Game',
                });
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });
//
//      end a round by changing the index of the round
//
        socket.on('server-endRound', function(msg){
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                games[dex].roundCount++;
                io.sockets.in(msg.gameCode).emit('redirect', '/game');
            }else{
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });

        socket.on('server-getScores', function(msg){
            let test = games.filter(function(e) { return e.gameCode == msg.gameCode; }).length > 0;
            if(test){
                let dex = games.findIndex(function(e) { return e.gameCode == msg.gameCode; });
                console.log('server-getScores',games[dex].playerPoints);
                socket.emit('client-getScores', games[dex]);
            }else{
               io.sockets.in(msg.gameCode).emit('message', {
                    username: 'Game Server',
                    text: 'Cant find Game',
                });
            }
        });

        
        
        // this will remove game from games array should also save to db
        socket.on('server-endGame', function(game){
            let test = games.filter(function(e) { return e.gameCode == game.gameCode; }).length > 0;
            if(test){
                // find the index of the game with gameCode
                let dex = games.findIndex(function(e) { return e.gameCode == game.gameCode; });
                // remove game from games
                games.splice(dex, 1);
                // make sure game is closed
                console.log(games);
                io.sockets.in(game.gameCode).emit('redirect', '/');
            }else{
                console.log('no game', games);
                // tell game bage there is no game
                socket.emit('redirect', '/');
            }
        });
        
        socket.on('disconnect', function(){
            userCount--;
            console.log('user disconnected ' + userCount + ' user(s)');
        });
    });

    return router;
}
