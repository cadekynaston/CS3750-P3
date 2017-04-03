window.onload = ()=>{
    let socket = io();

    let gameInfo = {
        username: document.getElementById('username').textContent,
        gameCode: document.getElementById('gameCode').textContent,
        lie: '',
        answer: '',
        mykey: '',
        host: false
    }
    socket.emit('connect-to-game-room', gameInfo)
    
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
        // get your player key so that you can add to your score
        Object.entries(game.players).forEach(([key, value])=> {
            if(gameInfo.username == value){
                gameInfo.mykey = key;
            }
        });
        if(game.playerCount == game.numPlayers){
            socket.emit('server-allPlayersIn', gameInfo);
            if(game.players['player0'] == gameInfo.username){
                socket.emit('server-getGameCategories', gameInfo);
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
            document.getElementById('createRound').disabled = false;
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
        // tell the other players a new round is being created
        socket.emit('server-newRound', gameInfo);
        var $template = $($('.creatRound_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);
        if(gameInfo.lie != ''){
            document.getElementById('createRound').disabled = true;
        }
        cat = categories;
        for(i=0;cat.length>i;i++){
            $('.form').append('<div><label><input type="radio" name="radio" id="'+ cat[i] + '">' + cat[i] + '</input></label></div>')
        };

        $('#createRound').click(function (e) {
            // make game object
            let round = {
                gameCode: gameInfo.gameCode,
                Category: '',
                Question: '',
                liesIn: 0,
                playerLies: {},
                answersIn: 0,
                playerAnswers: {}
            }
            
            // use for loop to get categories
            cat.forEach(function(element){
                if(document.getElementById(element).checked) // check for checked
                {
                    round.Category = element;
                }
            });

            socket.emit('server-createRound', round);
            console.log('create Round', round);
        });
    });
    
//  End Starting a new round 
// 
//  Code to make the new round work
    socket.on('client-startRound', function(round){
        var $template = $($('.gameRoundQuestion_template').clone().html());
        // add Question and Answer
        $template.find('.textCat').html(round.Category);
        $template.find('.textQue').html(round.Question);
        // but them on the page
        $('.game').children().remove();
        $('.game').append($template);

        $('#getAnswer').click(function (e) {
            gameInfo.lie =  $('.lie').val();
            
            socket.emit('server-updateRoundLies', gameInfo);

            console.log('lie sent', gameInfo);
        });
        
    })
//  
//  move into selection portion of round
// 
    socket.on('client-selectionRound', function(round){
        var $template = $($('.gameRoundAnswer_template').clone().html());
        $template.find('.textCat').html(round.Category);
        $template.find('.textQue').html(round.Question);
        $('.game').children().remove();
        $('.game').append($template);

        var $button = $($('.gameAnswers_template').clone().html());

        Object.entries(round.playerLies).forEach(([key, value])=> {
            $button.find('.text').html(value);
            $('.answers').append($button);
        });

        $('.selectLie').click(function (e) {
            // make game object
            gameInfo.answer = this.innerText;

            socket.emit('server-getRoundAnswers', gameInfo)
            console.log('lie selected', gameInfo);
        });
    });
      
    //show the scores
    socket.on('client-getScores', (game) => {
        var $template = $($('.gameEndRoundContainer_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);
        var $scores = $($('.gameEndRound_template').clone().html());
        Object.entries(game.players).forEach(([key, value])=> {
            $scores.find('.player').html(value);
            $scores.find('.score').html(game.playerPoints[key]);
            $('.scores').append($scores);
        });
        var $button;
        
        if(game.numRounds == game.roundCount+1){
            $button = $($('.endButton_template').clone().html());
        }else{
            $button = $($('.createButton_template').clone().html());
        }
        $('.next').append($button);

        $('.endGame').click(function (e) {
            console.log('End game', game);
            socket.emit('server-endGame', game);
        });
        $('.createButton').click(function (e) {
            console.log('End game', game);
            socket.emit('server-endRound', game);
        });

       
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
