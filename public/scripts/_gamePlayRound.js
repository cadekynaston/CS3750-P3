window.onload = ()=>{
    // controle round game play
    var gamePlay = function (arg) {
        
        var $template;
        $template = $($('.gamePlay_template').clone().html());
        $template.find('.question').html('This is your Question');
        $template.addClass(_this.message_side).find('.user').html(_this.user);
        $template.addClass(_this.message_side).find('.time').html(_this.time);
        console.log('text: '+_this.text+' user: '+_this.user+' time: '+_this.time);
        $('.messages').append($message);
                
    };
    socket.on('client-newRound', function(round){
        $('.game').children().remove();
        $('.game').append(`we have a round`);
        console.log(round);
    })

    
}