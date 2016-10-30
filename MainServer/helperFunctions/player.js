var net = require('net');
var _player = require('./playerList');
var io = require('../sockets').get_io();

module.exports = {
    
    login: function(deviceID) {
    },
    
    //updates player
    //will return player when done
    updatePlayerList: function(device, bodyKey, bodyValue, postURL) {
        var currentPlayer = -2; //returns if no players updated
        
        var confirm = this.confirmPlayerData(postURL, device, bodyKey, bodyValue);    
        if (confirm == -1) { return -1; }
        
        _player.playerList.forEach(function(element, index){

            if (element.device == device) {
                //because the bodyKey might be two deep in json, we need to eval it
                eval("element." + bodyKey + " = bodyValue");   
                currentPlayer = element;                
                console.log("updated " + bodyKey + " locally");
            } 

        });
        return currentPlayer;
    },
    
    martOption: function(player, optionValue, callback) {
        
        switch(optionValue) {
            case 1: //pokeball 200
                if (player.coins < 200) {
                    return callback("Not enough coins, sorry");
                } else {
                    
                    if (this.updatePlayerList(player.device, "coins", (player.coins - 200), "/updateCoins") == -1 ||
                        this.updatePlayerList(player.device, "items.Pokeball", player.items.Pokeball + 1, "/updateItem") == -1
                        ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback( "You just bought a Pokeball for 200 coins!" );
                    } 
                }           
                
               
                break;
                
            case 2: //Greatball 400
                if (player.coins < 400) {
                    return callback("Not enough coins, sorry");
                } else {
                    
                    if (this.updatePlayerList(player.device, "coins", (player.coins - 400), "/updateCoins") == -1 ||
                        this.updatePlayerList(player.device, "items.Greatball", player.items.Greatball + 1, "/updateItem") == -1
                        ) {                    
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback( "You just bought a Greatball for 400 coins!" );
                    }
                } 
                
                break;
                
            case 3: //Ultraball 750
                if (player.coins < 750) {
                    return callback("Not enough coins, sorry");
                } else {
                    
                    if (this.updatePlayerList(player.device, "coins", (player.coins - 750), "/updateCoins") == -1 ||
                        this.updatePlayerList(player.device, "items.Ultraball", player.items.Ultraball + 1, "/updateItem") == -1
                        ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback( "You just bought a Ultraball for 750 coins!" );
                    }
                } 
                
                break;
                
            case 4: //Potion 200
                if (player.coins < 200) {
                    return callback("Not enough coins, sorry");
                } else {
                    
                    if (this.updatePlayerList(player.device, "coins", (player.coins - 200), "/updateCoins") == -1 ||
                        this.updatePlayerList(player.device, "items.Potion", player.items.Potion + 1, "/updateItem") == -1
                        ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback( "You just bought a Potion for 200 coins!" );
                    }
                } 
                
                break;
                
            case 5: //Super Potion 350
                if (player.coins < 350) {
                    return callback("Not enough coins, sorry");
                } else {
                    
                    if (this.updatePlayerList(player.device, "coins", (player.coins - 350), "/updateCoins") == -1 ||
                        this.updatePlayerList(player.device, "items.SuperPotion", player.items.SuperPotion + 1, "/updateItem") == -1
                        ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback( "You just bought a SuperPotion for 350 coins!" );
                    }
                } 
                
                break;
        }   
                
            
    },
    //returns the array of all the current player data
    //scans for device, will give default otherwise
    scanPlayerData: function(listOfDevices, callback) {
        
        var returnList = [];
        var asyncReturnCount = 0;
        
        //can't use forEach due to async
//        for (var i = 0; i < listOfDevices.length; i++) {
        listOfDevices.forEach(function(element, index){
            var client = new net.Socket();
            client.setTimeout(2000);
            var raw_request = "GET /player HTTP/1.1";
            var responseData = "";

            client.connect(5000, "192.168.1." + element, function() {
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
    
    //returns if valid move in current player state
    //up = 0, right = 1, down = 2, left = 3
    // return -1 if in battle
    // return -2 if will move off grid
    checkValidMove: function(player, direction){
        
        if (player.mode.substring(0,1) == '2') {
            return -1; //in battle mode
        }
        
        switch(direction) {
            case 0: //up
                if (player.z + 8 > 252) {
                    return -2;
                } else {
                    return {"bodyKey" : "z", "bodyValue" : (player.z + 8)}
                }
            case 1: //right
                if (player.x - 8 < -252) {
                    return -2;
                } else {
                    return {"bodyKey" : "x", "bodyValue" : (player.x - 8)}
                }
            case 2: //down
                if (player.z - 8 < -252) {
                    return -2;
                } else {
                    return {"bodyKey" : "z", "bodyValue" : (player.z - 8)}
                }
            case 3: //left
                if (player.x + 8 > 252) {
                    return -2;
                } else {
                    return {"bodyKey" : "x", "bodyValue" : (player.x + 8)}
                }
        }
        
        return 0; //not a case
        
    },
    
    //returns value depending on passed in value
    //up = 0, right = 1, down = 2, left = 3, invalid = -1
    //
    //          0              
    //      3   x   1
    //          2
    //
    getDirection: function (direction) {
        switch(direction.toLowerCase()) {
            case "up":
                return 0;
            case "right":
                return 1;
            case "down":
                return 2;
            case "left":
                return 3;
        }
        
        return -1; //invalid direction
    },    
    
    //sends back data to Pi and will be able to validate the pi has been updated
    confirmPlayerData: function(postCall, device, bodyKey, bodyValue){
        var client = new net.Socket();
        client.setTimeout(2000);
        
        var raw_request = "POST " + postCall + " HTTP/1.1\n" + "{ " + bodyKey + " : " + bodyValue + " }\0";
        var responseData = "";

        client.connect(5000, "192.168.1." + device, function() {
            console.log('Connected');
            client.write(raw_request);
        });

        client.on('data', function(data) {
            console.log('Received: ' + data);
            responseData += data;
            client.destroy(); // kill client after server's response
        });

        client.on('close', function() {
            console.log('Connection closed');
            return responseData;
        });
        
        client.on('error', function() {
            console.log('Connection Failed with ' + device);
            return -1;
        });
        
        
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
    }
};


                        
               