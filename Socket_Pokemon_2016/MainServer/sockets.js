var socketio = require('socket.io');

var GlobalSocketObject;

module.exports.get_io = function(){
    return GlobalSocketObject;
}

module.exports.listen = function(server){
    
    io = socketio.listen(server);

    io.on('connection', function(client) {       

        console.log("connecting" + client.id);
        

        //on disconnect of application
        client.on('disconnect', function() { 
            console.log("disconnect" + client.id);         
        });

    }); //io.on end

    GlobalSocketObject = io; //saves so other files can import it
    
    return io;
}