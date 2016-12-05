//-------------------------Module "Importing"-----------------------------//
var express = require('express'); //used as routing framework
var app = express(); //creates an instance of express

//modules required (same idea of #includes or Imports)
var path = require('path'); //Node.js module used for getting path of file
var logger = require('morgan'); //used to log in console window all request
var cookieParser = require('cookie-parser'); //Parse Cookie header and populate req.cookies
var bodyParser = require('body-parser'); //allows the use of req.body in POST request
var server = require('http').createServer(app); //creates an HTTP server instance
var http = require('http'); //Node.js module creates an instance of HTTP to make calls to Pi
var io = require('./sockets').listen(server) //allows for sockets on the HTTP server instance
var extend = require('util')._extend; //used to make copy of objects -> extend({}, objToCopy);

//-------------------------Globals-----------------------------//
var _player = require("./helperFunctions/playerList"); //live list of players
var _liveSpaces = require("./helperFunctions/pokemonList"); //live list of spaces and their items

var localIP = require("ip").address(); //used to know where to check for web view site
console.log("Local IP: " + localIP);

var defaultPlayer = require('./setup/defaultPlayer'); //used as template for first time login

var debugMode = false;
//-------------------------getting funtions/routes from other files-----------------------------//
//api to mongoose calls
var api = require('./routes/api');

//helper functions for dealing with players, models, and battles, etc
var player_f = require('./helperFunctions/player'); 
var model_f = require('./helperFunctions/model');
var battle_f = require('./helperFunctions/battle'); 
var mongoDB_f = require('./helperFunctions/mongoDB'); 

//-------------------------Sets up MongoDB Connection-----------------------------//
var mongoURI = "mongodb://127.0.0.1:27017/IEEE"; //localhost:defaultPort/dataBase

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

//sets up Mongoose
var mongoose = require('mongoose'); //added for Mongo support
var MongooseDB = mongoose.connect(mongoURI).connection; //makes connection
MongooseDB.on('error', function(err) { console.log(err.message); console.log("Is MongoDB Running?"); });
MongooseDB.once('open', function() {
  console.log("mongooseDB connection open");
});
      
//-------------------------Node Setup-----------------------------//
//Loops through starting after "node server.js" and checks the arguments
for (var i = 2; i < process.argv.length; i++) {
    switch(process.argv[i]){
        case "-debug":
            console.log("RUNNING IN DEBUG MODE");
            debugMode = true;
    }
}

//-------------------------Gets Players Info-----------------------------//
//sets up raw MongoDB Node Driver
//get player online status
MongoClient.connect(mongoURI, function(err, db) {
    assert.equal(null, err);
    console.log("mongoDB connection open");

    //slight callback hell Ahead!
    
    //gets the player device ID from main server database
    mongoDB_f.getPlayerStatus(db, function(foundList) {
        
        //uses device numbers to scan for actual player data
        player_f.scanPlayerData(foundList, function(list) {
            
            _player.playerList = list;    
            console.log("Players All Set Up!");
            _player.playerList.forEach(function(element){
                console.log(element.device);
            });
            db.close(); 
        }); //uses list to search for player data
        
        
    });
    
    
});
            
            
//-------------------------Gets Models Info-----------------------------//
//grab all Pokemon to create a local statSheet and prevent a level of callbacks for each call
//Things like attack, value, etc don't change
var ModelSchema = require('./routes/models/models.model.js');
ModelSchema.find({}, function (err, post) {
    if (err) {
        console.error(err);
    }
    _liveSpaces.pokemonList = post;
   console.log(post.length + " Models added from Mongo"); 
});

//-------------------------Express JS configs-----------------------------//
// view engine setup
app.set('views', './views');
app.set('view engine', 'ejs');


//Express making use of these modules
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //sets all static file calls to folder


//-------------------------ROUTES-----------------------------//
app.use('/api', api); //sets the API used to access the Database

//used to help server know which device IDs are actually being used instead of scanning all 256
app.get('/login', function(req, res, next) {
    var device = parseInt( req.ip.split(/[.]+/).pop() );
    var playURL = localIP + ":8000/player/" + device;
    console.log("Log In request from Device: " + device);     
    
    var player = player_f.checkForPlayer(device, _player.playerList);
    
    // is player logged in already  
    if (player == -1) {
        
        //check if Pi has its own player data
        player_f.confirmPlayerData(2, "/player", device, "", "", "", function(data){

            if (data == "null") {            
                //not logged in
                return res.send("You need to set your Database up!\nrun setupMongoScript under /database\0");
                /* This makes template data, should get from Pi
                var newPlayer = extend({}, defaultPlayer); //makes copy of template
                newPlayer.device = device; //change device ID
                _player.playerList.push(newPlayer); //adds to list*/
            } else {

                _player.playerList.push(JSON.parse(data));
                io.emit('newPlayer', {"player" : JSON.parse(data)}); //so new player shows on screen
               
                //adds to database
                MongoClient.connect(mongoURI, function(err, db) {
                    assert.equal(null, err);

                  mongoDB_f.setOnline(db, device, function() {
                      db.close();
                  });
                });
                    return res.send("All ready to catch'em all!\nGo to: "+ playURL +"\0");
            }
        }); //confirm player data
        
    } else {
        return res.send("All ready logged in!\nGo to: "+ playURL +"\0");
    }     
       
});

//Will return link to view online graphics
app.get('/getLink', function(req, res, next) {
    var device = parseInt( req.ip.split(/[.]+/).pop() );
    console.log("Getting Link for Device: " + device);
    return res.send("Open Browser to: " + localIP + ":"+ server.address().port + "/player/" + device + "\n");
});

//takes care of moving
app.get('/move/:direction', function(req, res, next) {
    
    var device = parseInt( req.ip.split(/[.]+/).pop() ); //gets player device that sent request
    
    var player = player_f.checkForPlayer(device, _player.playerList);
    //checks if player is valid
    if (player == -1) { //not valid player
        return res.send("Player has not logged in to this game session\n use Login script to login\0");
    }
    
    //up = 0, right = 1, down = 2, left = 3, invalid = -1
    var direction = player_f.getDirection(req.params.direction);
    //checks for invalid option
    if (direction < 0) {
        return res.send("" + req.params.direction + " is an invalid move\noptions:\nup, right, left, down\0");
    }
    
    var validMove = player_f.checkValidMove(player, direction);
    //checks if move is valid
    if (validMove == -1) { //in battle
        return res.send("Player is currently in a battle\0");
    } else if (validMove == -2) { //off map
        return res.send("Player is at edge of map and cannot move that way\0");
    } 
    
    //If player is moving out of Market
    if (player.mode == "1") {
        
        if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1) {
            return res.send("MongoDB on Pi was not able to update\0");
        }                
        //updates mode to all web viewers
        io.emit('modeUpdate', {"mode" : "0", "device" : device}); 
    }
    
    //updates local copy
    player_f.updatePlayerListAsync(device, validMove.bodyKey, validMove.bodyValue, "/movePlayer", function(currentPlayer){
        
        if (currentPlayer == -1) { return res.send("MongoDB on Pi was not able to update\nIs the runServer script going?\0"); }  
        
        //updates player positions to all web viewers
        io.emit('movePlayer', {"x" : currentPlayer.x, "z" : currentPlayer.z, "device" : device}); 

        //fun of checking what they moved too
        model_f.checkSpace(currentPlayer, function(modelResult, err){ 
            //error with model checking
            if (err) { return res.send("ERROR:" + err + "\0"); }

            if (modelResult == 1) {
                //moved and nothing was there
                return res.send("Moved " + req.params.direction + "\0");
            }

            if (modelResult.pokemonID == 200) {
                //pokeball

                if (player_f.updatePlayerList(device, "items.Pokeball", currentPlayer.items.Pokeball + 1, "/updateItem") == -1) {
                    return callback(-1, "MongoDB on Pi was not able to update");
                } else {

                    io.emit('playerUpdate', {"player" : currentPlayer, "device" : device}); 

                    //sets model to offline after found
                    model_f.setOnlineStatus(modelResult.Name, false, function(statusResult, err){
                        if (err) { return res.send("ERROR:" + err + "\0"); }

                        if (statusResult == -1) { return res.send("ERROR [3.0.1]\0"); }//no Pokeball by Name found 

                        io.emit('modelUpdate', {"name" : modelResult.Name, "update" : { "liveOff" : true }}); //notifies all web clients

                        return res.send("Pokeball!\0"); 
                    });   


                }        

            } else if (modelResult.pokemonID == 201) {
                //pokeCenter

                if (player_f.updatePlayerList(device, "health", 100, "/updateHealth") == -1) {
                    return res.send("MongoDB on Pi was not able to update\0");
                }

                io.emit('playerUpdate', {"player" : currentPlayer, "device" : device});

                return res.send("You have been given full health!\0");

            } else if (modelResult.pokemonID == 202) {
                //pokeMart
                //mode set to 1

                if (player_f.updatePlayerList(device, "mode", "1", "/updateMode") == -1) {
                    return res.send("MongoDB on Pi was not able to update\0");
                }                
                //updates mode to all web viewers
                io.emit('modeUpdate', {"mode" : "1", "device" : device}); 

                return res.send("Want to buy an item?\0");

            } else {
                //pokemon

                //set player mode to battle
                var battleMode = "2" + modelResult.Name;

                if (player_f.updatePlayerList(device, "mode", battleMode, "/updateMode") == -1) {
                    return res.send("MongoDB on Pi was not able to update\0");
                }                
                //updates mode to all web viewers
                io.emit('modeUpdate', {"mode" : battleMode, "device" : device}); 

                //set pokemon to offline
                model_f.setOnlineStatus(modelResult.Name, false, function(statusResult, err){
                    if (err) { return res.send("ERROR:" + err + "\0"); }

                    if (statusResult == -1) { return res.send("ERROR [3.0.1]\0"); }//no Pokemon by Name found 

                    io.emit('modelUpdate', {"name" : modelResult.Name, "update" : { "liveOff" : true } });

                    //FINALLY returning a call back to client, about damn time
                    return res.send("A wild has " + modelResult.displayName + " appeared!\0");
                });                

            }


        }); //end of checkSpace
        
    });  //update player
   
    
   
}); //end of get('/move')

//device from 192.168.1.200 should be:
// /play/200
app.get('/player/:id', function(req, res, next) {    
    res.render('index', {
        "device": req.params.id,
        "debugMode": debugMode
    });   
});

//used to pick from various options
app.get('/option/:value', function(req, res, next) {
        
    var device = parseInt( req.ip.split(/[.]+/).pop() ); //gets player device that sent request
    
    var player = player_f.checkForPlayer(device, _player.playerList); //gets player info
    //checks if player is valid
    if (player == -1) { //not valid player
        return res.send("Player has not logged in to this game session\n use Login script to login\0");
    }
    
    //checks for valid number sent
    try {
        var optionValue = parseInt(req.params.value);
        if (optionValue == NaN || optionValue > 10 || optionValue <= -1) return res.send("No non-numbers in option choice\0");
    } catch(e) {
        return res.send("No non-numbers in option choice\0");
    }
    
    //Check for the mode in use
    if (player.mode == "1") {
        //In Mart
        
        player_f.martOption(player, optionValue, function(optionResult, err){
            if (err) { return res.send("ERROR: " + err + "\0"); }
            
            //updates stats to all web viewers
            io.emit('playerUpdate', {"player" : player, "device" : device}); 
            
            return res.send(optionResult + "\0");
            
        });
        
    } else if (player.mode.substring(0,1) == '2') {
        //Battle
        battle_f.option(player, optionValue, function(optionResult, err){
            if (err) { return res.send("ERROR: " + err + "\0"); }
                
            //updates stats to all web viewers
            io.emit('playerUpdate', {"player" : player, "device" : device}); 
            return res.send(optionResult + "\0");
            
        });
        
    } else {
        return res.send("No Options avaiable for use here\0");
    }
});

//used to see player list on server from browser
app.get('/getPlayers/:player', function(req, res, next) {
    
    var device = parseInt( req.ip.split(/[.]+/).pop() ); //gets player device that sent request
    var found = false;
    
    if (req.params.player == "all") {        
        res.json(_player.playerList);
    
    } else if (req.params.player == "me") {
        _player.playerList.forEach(function(element, index, array){
            if (element.device ==  device) {
                res.send(JSON.stringify(element, null, "\t"));
                found = true;
                return;
            }
        });
        //if not found
        if (!found) res.send("Could not find you! Did you rememeber to login?");
   
    } else {
        _player.playerList.forEach(function(element, index, array){
            if (element.device == req.params.player) {
                res.json(element);
                found = true;
                return;
            }
        });
        //if not found
        if (!found) res.send("Could not find " + req.params.player);
    }
});

//Used to test the server is up and running
//also to teach how Express and ejs work
app.get('/HelloWorld/:color', function(req, res, next) {
    
    var backgroundColor = req.params.color || "white"; //defaults if no param is passed
    
    res.render('HelloWorld', {
        message: "Server is up and running",
        color: backgroundColor        
    });   
});
//-------------------------Sockets-----------------------------//




//-------------------------HTTP Server Config-----------------------------//
server.listen(8000); //Port to listen on
server.on('listening', onListening);

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}




