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

//socket message for updates to player movement
socket.on('movePlayer', function(data){ 
    movePlayer(data.x, data.z, ("player" + data.device)); 
});

//used to handle differnt mode
socket.on('modeUpdate', function(data){
    //only worries if same device
    if (data.device == deviceID) {
        //TODO mode, device
        
        if (data.mode == "0") {
        //map mode
            sceneMode = 1;
            setHUDLayout(0);
            
        } else if (data.mode == "1") {
        //mart mode
            sceneMode = 1;
            setHUDLayout(2);
            
        } else if (data.mode.substring(0,1) == "2") {
        //battle mode
            sceneMode = 2;
            loadPokemon(element.mode.substring(1));
            setHUDLayout(1);
            
        }
    }
});

//socket message for updates to player list
socket.on('playerUpdate', function(data){ 
    if (data.device == deviceID) {       
        updateStats(data.player);
        redrawHealthBar();
    }
});

//socket message for updates to pokemon list
socket.on('pokemonUpdate', function(data){ 
    
});

//io.emit('playerUpdate', {"player" : currentPlayer, "device" : device}); 