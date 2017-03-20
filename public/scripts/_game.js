window.onload = ()=>{
    let socket = io();

    let gameInfo = {
        username: document.getElementById('username').textContent,
        gameCode: document.getElementById('gameCode').textContent,
    }
    socket.emit('connect-to-game-room', gameInfo)
    
    // test function click to run socket commands
    $('#test').click(function (e) {

        console.log('Action');
    });

    socket.on('message', (msg) =>{
        console.log(msg);
    });
    socket.on('no-game',function(){
        window.location.href = '/';
    })
}