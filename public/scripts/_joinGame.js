window.onload = ()=>{
    let socket = io();

    var validator = $("#joinForm").kendoValidator({

        rules: {

            userAlphanumeric: function(input) {
                // username must be alphanumeric
                if (input.is('#user')) {
                    var str = $('#username').val();
                    var patt = /^[a-z0-9_-]+$/i;
                    var res = patt.test(str);
                    return res;
                }
                return true;
            },
            
        },
        messages: {

            // custom error messages. email gets picked up 
            // automatically for any inputs of that type
            userAlphanumeric: 'Letters, Numbers, -, _ only',
            

        }

    }).getKendoValidator(); //.data('kendoValidator');


    $('#submit').click(function (e) {
        if (!validator.validate()) {
            // If the form is valid, the Validator will return true
            //do stuff
            event.preventDefault();
        }
        socket.emit('join-game-room', {
            username: $('#username').val(),
            gameCode: $('#gameCode').val()
        });
        console.log('click join');
    });
    socket.on('redirect',function(loc){
        window.location.href = loc;
    }) 
}