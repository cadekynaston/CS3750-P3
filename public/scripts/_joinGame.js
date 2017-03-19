window.onload = ()=>{
    let socket = io();
    
    let msg = {
        username: $('#user').val(),
        gameCode: $('#gameCode').val()
    };

    var validator = $("#joinForm").kendoValidator({

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
        
        console.log('click join');
    });
        
}