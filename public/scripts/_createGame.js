window.onload = ()=>{
    let socket = io();
    var validator = $("#createForm").kendoValidator({

        rules: {

            userAlphanumeric: function(input) {

                // username must be alphanumeric
                if (input.is('#username')) {
                    var str = $('#username').val();
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
        userAlphanumeric: 'Letters, numbers, -, _ only'
        }

    }).getKendoValidator(); //.data('kendoValidator');

    // add categories for testing 
    socket.emit('server-addCategory', 'Dog');
    
    var cat;
    // get Categories from mongo and populate create form 
    socket.emit('server-getCategories');
    socket.on('client-getCategories', function(categories){
        // get category template
        // fill with categories use for loop to add them to form
        cat = categories;
        console.log(categories);
        categories.forEach(function(element) {
            $('.checkbox-inline').append('<div><label><input type="checkbox" id="'
                 + element.category + '">' + element.category + '</input></label></div>');
        }, this);
    });

    $('#submit').click(function (e) {
        // make game object
        let game = {
            gameCode:  $('#gameCode').val(),
            numPlayers: $('#numPlayers').val(),
            playerCount: 1,
            players: {
                player0: $('#username').val(),
            },
            playerPoints: {
                player0: 0,
            },
            numRounds: $('#numRounds').val(),
            categories: {},
            round: [],
        }

        var i = 0;
        // use for loop to get categories
        cat.forEach(function(element){
            if(document.getElementById(element.category).checked) // check for checked
            {
                catname = 'category' + i++;
                game.categories[catname]=element.category;
                console.log(element.category, catname);
            }
        });
        //game.categories[category0] = 0// some check box id

        if (!validator.validate()) {
            // If the form is valid, the Validator will return true
            //do stuff
            event.preventDefault();
        }
        socket.emit('create', game);
        console.log('click join');
    });
    
    
}