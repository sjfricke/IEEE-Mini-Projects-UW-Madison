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
var _player = []; //live list of players
var _liveSpaces = []; //live list of spaces and their items

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

//sets up raw MongoDB Node Driver
//get player online status
MongoClient.connect(mongoURI, function(err, db) {
    assert.equal(null, err);
    console.log("mongoDB connection open");

    //slight callback hell Ahead!
    
    //gets the player device ID from main server database
    mongoDB_f.getPlayerStatus(db, function(foundList) {
        
        //uses device numbers to scan for actual player data
        player_f.getPlayerData(foundList, function(list) {
            
            _player = list;    
            console.log("Players All Set Up!");
            console.dir(_player);
            db.close(); 
        }); //uses list to search for player data
        
        
    });
    
    
});

//sets up Mongoose
var mongoose = require('mongoose'); //added for Mongo support
var MongooseDB = mongoose.connect(mongoURI).connection; //makes connection
MongooseDB.on('error', function(err) { console.log(err.message); console.log("Is MongoDB Running?"); });
MongooseDB.once('open', function() {
  console.log("mongooseDB connection open");
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
app.use('/api', api);

app.get('/', function(req, res, next) {
    var net = require('net');

    var client = new net.Socket();
    var raw_request = "GET /status HTTP/1.1\nData";
    var responseData = "";

    client.connect(5000, '10.0.0.228', function() {
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
        res.send(responseData);
    });

    var options = {
        host: '10.0.0.228:2600',
        path: '/level'
    };


});

//used to help server know which device IDs are actually being used instead of scanning all 256
app.get('/login', function(req, res, next) {
    var device = req.ip.split(/[.]+/).pop();
    if (typeof device === "string") {device = parseInt(device);}
    
    console.log("Log In request from Device: " + device);     
    
    var player = player_f.checkForPlayer(device, _player);
    
    if (player == -1) {
        var newPlayer = extend({}, defaultPlayer); //makes copy of template
        newPlayer.device = device; //change device ID
        _player.push(newPlayer); //adds to list
        
        //adds to database
        MongoClient.connect(mongoURI, function(err, db) {
            assert.equal(null, err);

          mongoDB_f.setOnline(db, device, function() {
              db.close();
          });
        });
        
        res.send("BODY:All ready to catch'em all!\n\0");
    } else {
        res.send("BODY:All ready logged in!\n\0");
    }
    
});

app.get('/getLink', function(req, res, next) {
    var device = req.ip.split(/[.]+/).pop();
    console.log("Getting Link for Device: " + device);
    res.send("BODY:Open Browser to: " + localIP + ":"+ server.address().port + "/play/" + device + passwordList[device].password+"\n");
});

app.get('/move/:direction', function(req, res, next) {
    io.to(passwordList[req.ip.split(/[.]+/).pop()].socketID).emit('movePlayer', req.params.direction); //send updated equation
    res.send("BODY:Moved");
});

app.get('/test2', function(req, res, next) { 
    console.log("socketID: " + passwordList[req.ip.split(/[.]+/).pop()].socketID);
    io.to(passwordList[ req.ip.split(/[.]+/).pop()].socketID).emit('test', "socket Test message"); //send updated equation
    res.send("BODY:sent");
});

//device from 10.0.0.200 and a pass of 3465 should be:
// /play/2003465
app.get('/play/:id', function(req, res, next) {
    if (passwordList[req.params.id.substr(0,req.params.id.length - passLength)].password != req.params.id.substr(req.params.id.length - passLength)) {
        //checks if password matches ID of device
        //TODO: not make such a bloated IF statement
        res.send("Incorrect Link");
    } else {
        
        res.render('index', {
            device: req.params.id.substr(0,req.params.id.length - passLength)
        });        
    } 
});

app.get('/pokemonData', function(req, res, next) {
    
});
//app.get('/setGameUp', function(req, res, next) {
//   res.render('setGame');
//});
//app.post('/loadPokemon', function(req, res, next) {
//   console.dir(req.body);
//   res.send("done");
//});

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



