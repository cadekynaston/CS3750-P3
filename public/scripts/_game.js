window.onload = ()=>{
    let socket = io();

    let msg = {
        username: $('#user').val(),
        gameCode: $('#gameID').val()
    }

    socket.emit('join', msg)
    socket.on('message', (msg) =>{
        console.log(msg);
    });
}