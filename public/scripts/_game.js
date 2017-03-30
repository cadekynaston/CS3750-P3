window.onload = ()=>{
    let socket = io();

    let gameInfo = {
        username: document.getElementById('username').textContent,
        gameCode: document.getElementById('gameCode').textContent,
        answer: '',
        host: false
    }
    socket.emit('connect-to-game-room', gameInfo)
    socket.on('wait', function(msg){
        var $template = $($('.waitScreen_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);
        $('.wait').children().remove();
        $('.wait').append(msg.text);
    })
//
//  check game host
//
    socket.on('client-gameStart', function(game){
        console.log('client-gameStart',game);
        if(game.players['player0'] == gameInfo.username){
            socket.emit('server-getGameCategories', gameInfo);
        }else{
            // show wait screen
            var $template = $($('.waitScreen_template').clone().html());
            $('.game').children().remove();
            $('.game').append($template);
        }
    })
//  
//  Code For Starting a new round
//  
    let cat;
    socket.on('client-getGameCategories', function(categories){
        console.log('client-getGameCategories', categories, categories.length);
        var $template = $($('.creatRound_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);
        cat = categories;
        for(i=0;cat.length>i;i++){
            console.log('inside', cat[i])
            $('.form').append('<div><label><input type="radio" name="radio" id="'+ cat[i] + '">' + cat[i] + '</input></label></div>')
        };
        $('#createRound').click(function (e) {
            // make game object
            let round = {
                gameCode: gameInfo.gameCode,
                category: '',
                playerQuestion: '',
                playerAnswers: {}
            }
            
            // use for loop to get categories
            cat.forEach(function(element){
                if(document.getElementById(element).checked) // check for checked
                {
                    console.log(element);
                    round.category = element;
                }
            });

            socket.emit('server-createRound', round);

            
            console.log('create Round');
        });
    });
    
//  End Starting a new round 
// 
//  Code to make the new round work
    socket.on('client-newRound', function(round){
        var $template = $($('.gameRoundQuestion_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);


        $('#getAnswer').click(function (e) {
            gameInfo.answer =  $('.answer').val()
            
            socket.emit('server-updateRoundAnswers', gameInfo);

            
            console.log('answer sent');
        });
        console.log(round);
    })
//  
//  move into selection portion of round
// 
    socket.on('client-selectionRound', function(round){
        var $template = $($('.gameRoundAnswer_template').clone().html());
        $('.game').children().remove();
        $('.game').append($template);

        $('#answerLies').onClick(function (e) {
            // make game object
            gameInfo.lie = $('.#answerLies').val();

            socket.emit('server-updateRoundLies', gameInfo)
            console.log('lies sent');
        });
    })

    //show the scores
    socket.on('client-getScores', (scores) => {
        console.log(scores);
    });

      
    //show the scores
    socket.on('client-getScores', (scores) => {
        console.log(scores);
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
        console.log(msg);
        $('.message').append(msg);
    });
    socket.on('no-game',function(){
        window.location.href = '/';
    })
}
