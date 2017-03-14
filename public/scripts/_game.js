window.onload = ()=>{
    let socket = io();

    socket.on('message', (msg) =>{
        console.log(msg);
    });
}