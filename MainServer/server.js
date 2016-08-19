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
var io = require('socket.io')(server); //allows for sockets on the HTTP server instance
var extend = require('util')._extend; //used to make copy of objects -> extend({}, objToCopy);

//-------------------------Globals-----------------------------//
var _player = require("./helperFunctions/playerList"); //live list of players
var _liveSpaces = require("./helperFunctions/pokemonList"); //live list of spaces and their items

var localIP = require("ip").address(); //used to know where to check for web view site
console.log("Local IP: " + localIP);

//gets generated password list
var passLength = 4;//Assume passwords are 4 char long
var passwordList = require('./passwordList');

var defaultPlayer = require('./setup/defaultPlayer'); //used as template for first time login
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
    
    console.log("Log In request from Device: " + device);     
    
    var player = player_f.checkForPlayer(device, _player.playerList);
    
    if (player == -1) {
        var newPlayer = extend({}, defaultPlayer); //makes copy of template
        newPlayer.device = device; //change device ID
        _player.playerList.push(newPlayer); //adds to list
        
        //adds to database
        MongoClient.connect(mongoURI, function(err, db) {
            assert.equal(null, err);

          mongoDB_f.setOnline(db, device, function() {
              db.close();
          });
        });
        
        return res.send("BODY:All ready to catch'em all!\n\0");
    } else {
        return res.send("BODY:All ready logged in!\n\0");
    }
    
});

//Will return link to view online graphics
app.get('/getLink', function(req, res, next) {
    var device = parseInt( req.ip.split(/[.]+/).pop() );
    console.log("Getting Link for Device: " + device);
    return res.send("BODY:Open Browser to: " + localIP + ":"+ server.address().port + "/play/" + device + passwordList[device].password+"\n");
});

//takes care of moving
app.get('/move/:direction', function(req, res, next) {
    
    var device = parseInt( req.ip.split(/[.]+/).pop() ); //gets player device that sent request
    
    var player = player_f.checkForPlayer(device, _player.playerList);
    //checks if player is valid
    if (player == -1) { //not valid player
        return res.send("BODY:Player has not logged in to this game session\n use Login script to login\0");
    }
    
    //up = 0, right = 1, down = 2, left = 3, invalid = -1
    var direction = player_f.getDirection(req.params.direction);
    //checks for invalid option
    if (direction < 0) {
        return res.send("BODY:" + req.params.direction + " is an invalid move\noptions:\nup, right, left, down\0");
    }
    
    var validMove = player_f.checkValidMove(player, direction);
    //checks if move is valid
    if (validMove == -1) { //in battle
        return res.send("BODY:Player is currently in a battle\0");
    } else if (validMove == -2) { //off map
        return res.send("BODY:Player is at edge of map and cannot move that way\0");
    } 
    
    //If player is moving out of Market
    if (player.mode == "1") {
        
        if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1) {
            return res.send("BODY:MongoDB on Pi was not able to update\0");
        }                
    }
    
    //updates local copy
    var currentPlayer = player_f.updatePlayerList(device, validMove.bodyKey, validMove.bodyValue, "/movePlayer");    
    if (currentPlayer == -1) { return res.send("BODY:MongoDB on Pi was not able to update\0"); }               
    
    io.to(passwordList[device].socketID).emit('movePlayer', currentPlayer); //send update to client
    
    //fun of checking what they moved too
    model_f.checkSpace(currentPlayer, function(modelResult, err){ 
        //error with model checking
        console.log("debug");
        console.log(modelResult);
        if (err) { return res.send("BODY:" + err + "\0"); }
        
        if (modelResult == 1) {
            //moved and nothing was there
            return res.send("BODY:Moved " + req.params.direction + "\0");
        }
        
        if (modelResult.pokemonID == 200) {
            //pokeball
            if (player_f.updatePlayerList(device, "items.Pokeball", currentPlayer.items.Pokeball + 1, "/updateItem") == -1) {
                return callback(-1, "MongoDB on Pi was not able to update");
            } else {
                
                model_f.setOnlineStatus(modelResult.Name, false, function(statusResult, err){
                    if (err) { return res.send("BODY:" + err + "\0"); }
                    
                    if (statusResult == -1) { return res.send("BODY:ERROR [3.0.1]\0"); }//no Pokeball by Name found 
                    
                    return res.send("BODY:Pokeball!\0"); 
                });   
                
                 
            }        
                       
        } else if (modelResult.pokemonID == 201) {
            //pokeCenter
            
            if (player_f.updatePlayerList(device, "health", 100, "/updateHealth") == -1) {
                return res.send("BODY:MongoDB on Pi was not able to update\0");
            }                
            
            return res.send("BODY:You have been given full health!\0");
            
        } else if (modelResult.pokemonID == 202) {
            //pokeMart
            //mode set to 1
            
            if (player_f.updatePlayerList(device, "mode", "1", "/updateMode") == -1) {
                return res.send("BODY:MongoDB on Pi was not able to update\0");
            }                
            
            return res.send("BODY:Want to buy an item?\0");
            
        } else {
            //pokemon
            
            //set player mode to battle
            var battleMode = "2" + modelResult.Name;

            if (player_f.updatePlayerList(device, "mode", battleMode, "/updateMode") == -1) {
                return res.send("BODY:MongoDB on Pi was not able to update\0");
            }                

            //set pokemon to offline
            model_f.setOnlineStatus(modelResult.Name, false, function(statusResult, err){
                if (err) { return res.send("BODY:" + err + "\0"); }

                if (statusResult == -1) { return res.send("BODY:ERROR [3.0.1]\0"); }//no Pokemon by Name found 

                io.to(passwordList[device].socketID).emit('battle', modelResult); //send update to client

                //FINALLY returning a call back to client, about damn time
                return res.send("BODY:A wild has " + modelResult.displayName + " appeared!\0");
            });                
            
        }
        
        
    }); //end of checkSpace
    
   
}); //end of get('/move')

//device from 10.0.0.200 and a pass of 3465 should be:
// /play/2003465
app.get('/play/:id', function(req, res, next) {
    if (passwordList[req.params.id.substr(0,req.params.id.length - passLength)].password != req.params.id.substr(req.params.id.length - passLength)) {
        //checks if password matches ID of device
        //TODO: not make such a bloated IF statement
        return res.send("Incorrect Link");
    } else {
        
        return res.render('index', {
            device: req.params.id.substr(0,req.params.id.length - passLength)
        });        
    } 
});

//used to pick from various options
app.get('/option/:value', function(req, res, next) {
        
    var device = parseInt( req.ip.split(/[.]+/).pop() ); //gets player device that sent request
    
    var player = player_f.checkForPlayer(device, _player.playerList); //gets player info
    //checks if player is valid
    if (player == -1) { //not valid player
        return res.send("BODY:Player has not logged in to this game session\n use Login script to login\0");
    }
    
    //checks for valid number sent
    try {
        var optionValue = parseInt(req.params.value);
    } catch(e) {
        return res.send("BODY:No non numbers in option choice\0");
    }
    
    //Check for the mode in use
    if (player.mode == "1") {
        //In Mart
        
        player_f.martOption(player, optionValue, function(optionResult, err){
            if (err) { return res.send("BODY:" + err + "\0"); }
            
            return res.send("BODY:" + optionResult + "\0");
            
        });
        
    } else if (player.mode.substring(0,1) == '2') {
        //Battle
        battle_f.option(player, optionValue, function(optionResult, err){
            if (err) { return res.send("BODY:" + err + "\0"); }
            
            return res.send("BODY:" + optionResult + "\0");
            
        });
        
    } else {
        return res.send("BODY:No Options avaiable for use here\0");
    }
});


//-------------------------Sockets-----------------------------//
io.on('connection', function(client) {       
    
    console.log("connecting" + client.id);

    //used right after socket connects for client to send its device ID
    //ID is set in passwordList
    client.on('setSocketID', function(data) {
        passwordList[data].socketID = client.id;                
    });
    
    //on disconnect of application
    client.on('disconnect', function() { 
        console.log("disconnect" + client.id);         
    });
    
}); //io.on end



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




