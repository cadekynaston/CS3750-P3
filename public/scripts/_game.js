window.onload = ()=>{
    let socket = io();

    let msg = {
        username: $('#user').val(),
        gameCode: $('#gameCode').val(),
        numPlayers: $('#numPlayers').val(),
        numRounds: $('#numRounds').val(),
        categorys: {
            catname: $('.catname').val()
        }
    }

    socket.emit('join', msg)
    socket.on('message', (msg) =>{
        console.log(msg);
    });
    socket.on('no-game',function(){
        window.location.href = '/';
    })
}