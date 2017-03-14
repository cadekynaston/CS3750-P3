window.onload = ()=>{
    let socket = io();
    let msg = {
        username: document.getElementById('user').textContent,
        room: document.getElementById('gameID').textContent
    };
    $('.join_game').click(function (e) {
        socket.emit('join', msg);
        console.log('click join');
    });
    
    
}