var net = require('net');
module.exports = {
    
    login: function(deviceID) {
        console.log("debug");
    },
    
    //returns the array of all the current player data
    //scans for device, will give default otherwise
    getPlayerData: function(listOfDevices, callback) {
        
        var returnList = [];
        var asyncReturnCount = 0;
        
        //can't use forEach due to async
//        for (var i = 0; i < listOfDevices.length; i++) {
        listOfDevices.forEach(function(element, index){
            var client = new net.Socket();
            client.setTimeout(2000);
            var raw_request = "GET /player HTTP/1.1";
            var responseData = "";

            client.connect(5000, "10.0.0." + element, function() {
                console.log(element + ' Connected');
                client.write(raw_request);
            });

            client.on('data', function(data) {
                console.log('Received: ' + data);
                responseData += data;
                client.destroy(); // kill client after server's response
            });

            client.on('close', function() {
                console.log(element + ' Connection closed');
                asyncReturnCount++;
                try {
                    returnList.push(JSON.parse(responseData));
                } catch(e){
                    console.log(element + " Not returning JSON:");    
                    console.log(responseData);    
                }
                if (asyncReturnCount == listOfDevices.length) {callback(returnList);}
                return;

            }); 
            
            client.on('timeout', function(e) {
                asyncReturnCount++;
                console.log(element + " could not connect/Timeout"); 
                if (asyncReturnCount == listOfDevices.length) {callback(returnList);}
                client.destroy(); 
                return;
            });
                      
            client.on('error', function(){
               console.log(element + " could not connect");
               client.destroy(); 
                return;
            });
        });
    },
    
    //checks for player and returns player if found, otherwise returns -1
    checkForPlayer: function(deviceID, list) {
        var returnVar = -1; //return in forEach doesn't return from function
        
        if (typeof deviceID === "string") {deviceID = parseInt(deviceID);}
        
        list.some(function(element, index, array){
            if (element.device == deviceID) {
                returnVar = element;
                return;
            }
        });  
        
        return returnVar;
    },
    
    //used to move player 
    movePlayer: function () {
//        switch(direction.toLowerCase()) {
//            case "up":
//                playerModel.position.z += 8;
//                break;
//            case "left":
//                playerModel.position.x += 8;
//                break;
//            case "right":
//                playerModel.position.x -= 8;
//                break;
//            case "down":
//                playerModel.position.z -= 8;
//                break;
//        }
//
//        controls.target = playerModel.position; //sets the aim of the orbit control
    },
    
    //returns THREE.Vec3 where x and z are random, y is 0
    randomPosition: function () {
//        var ranX = Math.floor(Math.random() * gridLength); //between 0 and gridlength 
//        var ranZ = Math.floor(Math.random() * gridLength); //between 0 and gridlength 
//
//        // ( (x-(gridLength/2)) * squareSize ) + squareSize/2
//        ranX = ( (ranX - 32) * 8 ) + 4;
//        ranZ = ( (ranZ - 32) * 8 ) + 4;
//        return {"x" : ranX, "z" : ranZ};
    },

    //returns element id of space (-1 for nothing)
    checkSpace: function(xPos, zPos, _liveSpaces) {
//        liveSpaces.forEach(function(element, index, array){
//            if (xPos == element.x && zPos == element.z && element.live) {
//                return element.ID;
//            }
//        });
//        return -1;
    }
};


                        
               