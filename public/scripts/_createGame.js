window.onload = ()=>{
    let socket = io();
    var validator = $("#createForm").kendoValidator({

        rules: {

            userAlphanumeric: function(input) {

                // username must be alphanumeric
                if (input.is('#user')) {
                    var str = msg.username;
                    var patt = /^[a-z0-9_-]+$/i;
                    var res = patt.test(str);
                    return res;
                }
                return true;
            }
        },
        messages: {

        // custom error messages. email gets picked up 
        // automatically for any inputs of that type
        // userAlphanumeric: 'Letters, numbers, -, _ only'
        }

    }).getKendoValidator(); //.data('kendoValidator');


    $('#submit').click(function (e) {
        let msg = {
            username: $('#username').val(),
            gameCode: $('#gameCode').val(),
            numPlayers: $('#numPlayers').val(),
            numRounds: $('#numRounds').val(),
            categorys: {
                catname: $('#catname').val()
            }
        };
        if (!validator.validate()) {
            // If the form is valid, the Validator will return true
            //do stuff
            event.preventDefault();
        }
        socket.emit('create', msg);
        console.log('click join');
    });
    
    
}