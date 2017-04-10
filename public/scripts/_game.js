window.onload = ()=>{
    let socket = io();
    let counter = setInterval(()=>{},100000);
    let gameInfo = {
        username: document.getElementById('username').textContent,
        gameCode: document.getElementById('gameCode').textContent,
        lie: '',
        answer: '',
        mykey: ''
    }
    let shuffle = (array) =>{
        let curDex = array.length, temVal, randDex;
        while(0 != curDex){
            randDex = Math.floor(Math.random() * curDex);
            curDex--;

            temVal = array[curDex];
            array[curDex] = array[randDex];
            array[randDex] = temVal;
        }
        return array;
    }
    socket.emit('connect-to-game-room', gameInfo)
    window.onbeforeunload = () => {
        socket.emit('client-leave', gameInfo);
    };

    socket.on('wait', function(msg){
        var $template = $($('.waitScreen_template').clone().html());
        $template.find('.text').html(msg.text);
        $('.game').children().remove();
        $('.game').append($template);
        
    })
//
//  check game host
//
    socket.on('client-gameStart', function(game){
        clearInterval(counter);
        $('.timer').html(' ');
        // get your player key so that you can add to your score
        Object.entries(game.players).forEach(([key, value])=> {
            if(gameInfo.username == value){
                gameInfo.mykey = key;
            }
        });
        if(game.playerCount == game.numPlayers){
            socket.emit('server-allPlayersIn', gameInfo);
            if(game.players['player0'] == gameInfo.username){
                window.setTimeout(function(){
                    socket.emit('server-getGameCategories', gameInfo);
                }, 500);
            }
            
        }else{
            // show wait screen
            var $template = $($('.waitScreen_template').clone().html());
            $template.find('.text').html('Waiting for Players To Join Round');
            $('.game').children().remove();
            $('.game').append($template);
            if(game.players['player0'] == gameInfo.username){
                window.setTimeout(function(){
                    socket.emit('server-getGameCategories', gameInfo);
                }, 500);
            }
        }
    });

    socket.on('client-allPlayersIn', function(game){
        if(game.players['player0'] == gameInfo.username){
            window.setTimeout(function(){
                document.getElementById('createRound').disabled = false;
            }, 1000);
            
        }else{
            var $template = $($('.waitScreen_template').clone().html());
            $template.find('.text').html('Waiting for Host To Start Round');
            $('.game').children().remove();
            $('.game').append($template);
        }
    });
//  
//  Code For Starting a new round
//  
    let cat;
    socket.on('client-newRound', function(categories){
        clearInterval(counter);
        $('.timer').html(' ');
        // tell the other players a new round is being created
        socket.emit('server-newRound', gameInfo);
        var $template = $($('.creatRound_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);

        cat = categories;
        for(i=0;cat.length>i;i++){
            $('.form').append('<div><label><input type="radio" name="radio" id="'+ cat[i] + '">' + cat[i] + '</input></label></div>')
        };

        document.getElementById('createRound').disabled = true;
        

        $('#createRound').click(function (e) {
            // make game object
            let round = {
                gameCode: gameInfo.gameCode,
                Category: '',
                Question: '',
                liesIn: 0,
                playerLies: [],
                answersIn: 0,
                playerAnswers: []
            }
            
            // use for loop to get categories
            cat.forEach(function(element){
                if(document.getElementById(element).checked) // check for checked
                {
                    round.Category = element;
                }
            });

            if(round.Category){socket.emit('server-createRound', round);}
            console.log('create Round', round);
        });
    });
    
//  End Starting a new round 
// 
//  Code to make the new round work
    socket.on('client-startRound', function(round){
        clearInterval(counter);
        $('.timer').html(' ');
        var $template = $($('.gameRoundQuestion_template').clone().html());
        // add Question and Answer
        $template.find('.textCat').html(round.Category);
        $template.find('.textQue').html(round.Question);
        // but them on the page
        $('.game').children().remove();
        $('.game').append($template);


        sendLieTimer =setTimeout(()=>{
            gameInfo.lie =  'Player didn`t Answer';
            console.log('lie sent', gameInfo);
            clearInterval(counter);
            $('.timer').html(' ');
            socket.emit('server-updateRoundLies', gameInfo);
        }, 20000);
        timer=20;
        counter = setInterval(()=>{
            timer--;
            console.log(timer);
            $('.timer').html(timer);
        }, 1000);

        $('#getAnswer').click(function (e) {
            gameInfo.lie =  $('.lie').val();
            clearTimeout(sendLieTimer);
            if(gameInfo.lie) {
                socket.emit('server-updateRoundLies', gameInfo);
                console.log('lie sent', gameInfo);
            }else{
                console.log('failure to retrieve value')
                e.preventDefault();
            }
        });
        
    });
//  
//  move into selection portion of round
// 
    socket.on('client-selectionRound', function(round){
        clearInterval(counter);
        $('.timer').html(' ');
        var $template = $($('.gameRoundAnswer_template').clone().html());
        $template.find('.textCat').html(round.Category);
        $template.find('.textQue').html(round.Question);
        $('.game').children().remove();
        $('.game').append($template);

        var $button = $($('.gameAnswers_template').clone().html());
        round.playerLies = shuffle(round.playerLies);
        for(i=0;i<=round.liesIn;i++){
            Object.entries(round.playerLies[i]).forEach(([key, value])=> {
                $button.find('.text').html(value);
                $('.answers').append($button);
            });
        }
        answerTimer = setTimeout(()=>{
            gameInfo.answer = gameInfo.lie;
            clearInterval(counter);
            $('.timer').html(' ');
            socket.emit('server-getRoundAnswers', gameInfo)
        }, 11000);
        timer=10;
        counter = setInterval(()=>{
            timer--;
            console.log(timer);
            $('.timer').html(timer);
        }, 1000);

        $('.selectLie').click(function (e) {
            clearTimeout(answerTimer);
            // make game object
            gameInfo.answer = this.innerText.trim();

            if(gameInfo.answer){
                socket.emit('server-getRoundAnswers', gameInfo)
                console.log('lie selected', gameInfo);
            }else{
                console.log('failure to retrieve value')
                e.preventDefault();
            }
        });
    });
      
    //show the scores
    socket.on('client-getScores', (game) => {
        clearInterval(counter);
        $('.timer').html(' ');
        var $answer = $($('.gameCorrectAnswer_template').clone().html());
        $('.game').children().remove();
        $answer.find('.player').html(game.round[game.roundCount].Question);
        $answer.find('.answer').html(game.round[game.roundCount].playerLies[0]['Answer']);
        $('.game').append($answer);


        setTimeout(()=>{var $template = $($('.gameEndRoundContainer_template').clone().html());
            $('.game').children().remove();
            $('.game').append($template);
            var $scores = $($('.gameEndRound_template').clone().html());

            // SORT SCORES
            let playersPoints = game.playerPoints;
            console.log('points object',playersPoints)
            var sortable = [];
            for(var player in playersPoints){
                sortable.push([player, playersPoints[player]]);
            }
            sortable.sort((a, b)=>{
                return b[1] - a[1];
            })
            console.log('sorted array',sortable);
            for(i=0;i<sortable.length;i++){
                let player = sortable[i];
                $scores.find('.player').html(game.players[player[0]]);
                $scores.find('.score').html(player[1]);
                $('.scores').append($scores);
            }
            
            var $button;
            var $restartButton;
            if(game.numRounds == game.roundCount+1){
                $button = $($('.endButton_template').clone().html());
                $restartButton = $($('.restartButton_template').clone().html());
                $('.next').append($restartButton);
            }else{
                $button = $($('.nextButton_template').clone().html());
                endRoundTimer =setTimeout(()=>{
                    console.log('End round', game);
                    socket.emit('server-endRound', game);
                    clearInterval(counter);
                    $('.timer').html(' ');
                }, 10000);
                timer=9;
                counter = setInterval(()=>{
                    timer--;
                    console.log(timer);
                    $('.timer').html(timer);
                }, 1000);
            }
            $('.next').append($button);
            

            $('.restartGame').click(function () {
                //alert('restart working');
                socket.emit('server-restartGame', game);
                
            });

            $('.endGame').click(function (e) {
                let temp = sortable[0]
                console.log(temp[0]);
                game.winner = game.players[temp[0]];
                console.log('End game', game);
                socket.emit('server-endGame', game);
            });
            
            $('.createButton').click(function (e) {
                clearTimeout(endRoundTimer);
                console.log('End round', game);
                socket.emit('server-endRound', game);
            });
        }, 7000); 
       
    });
    socket.on('client-restartGame', function(game){
        socket.emit('connect-to-game-room', gameInfo);
    });
    socket.on('changeNextButton', function(){
        $button = $($('.nextButton_template').clone().html());
        $('.next').html($button);
    });
    
    
    // test function click to run socket commands
    $('#test').click(function (e) {
        socket.emit('send',{
            gameCode: gameInfo.gameCode,
            username: gameInfo.username,
            text: 'did it work'
        })
        console.log('Action');
    });
    socket.on('message', (msg) =>{
        console.log('message recived',msg);
        $('.message').append(msg);
    });
    socket.on('redirect',function(loc){
        window.location.href = loc;
    })
}

function keyPress(e)
{
    // look for window.event in case event isn't passed in
    e = e || window.event;
    if (e.keyCode == 13)
        document.getElementById('getAnswer').click();
}