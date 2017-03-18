window.onload = ()=>{
    let socket = io();

    let msg = {
        username: $('#user').val(),
        room: $('#gameCode').val(),
        numPlayers: $('#numPlayers').val(),
        numRounds: $('#numRounds').val(),
        categorys: {
            catname: $('#catname').val()
        }
    }

    socket.emit('create', msg)
    socket.on('message', (msg) =>{
        console.log(msg);
    });
}