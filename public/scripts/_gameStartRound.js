window.onload = ()=>{
    // start game by creating a new round
    var $template = $($('.creatRound_template').clone().html());
    let cat;
    socket.on('client-getGameCategories', function(categories){
        console.log('client-getGameCategories', categories, categories.length);
        console.log('hi')
        cat = categories;
        for(i=0;cat.length>i;i++){
            console.log('inside')
            $template.find('form').append('<input type="radio" name="radio" id="'+ 
                cat[i] + '">' + cat[i] + '</input>');
        };
        $('.game').append($template);
    });


    $('#createRound').click(function (e) {
        // make game object
        let round = {
            gameCode: document.getElementById('gameCode').textContent,
            category: '',
            Questions: '',
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
}