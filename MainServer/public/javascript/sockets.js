var socket = io.connect();
socket.on('connect', function(data) { 
//    $.get("/api/players/device/" + deviceID, function(result){
//        var mode = result[0].mode;
//        init(mode);
//        animate();
//    });
//    //used to send socket device ID right away
//    socket.emit('setSocketID', deviceID ); 
});

socket.on('movePlayer', function(data){
    console.log(data);
    movePlayer(data);
});

socket.on('test', function(data){
    console.log(data);
});