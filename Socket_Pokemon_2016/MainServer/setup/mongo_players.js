/*
* Sets up database for players collection
* to clear database: 
*    node mongo_player.js reset 
*/

// Retrieve
var MongoClient = require('mongodb').MongoClient;
var adding = true;
var deleting = true;


// Connect to the db
MongoClient.connect("mongodb://localhost:27017/IEEE", function(err, db) {
    if(err) { return console.dir(err); }    

    var collection = db.collection('Players');
    
    //clears database
    if (process.argv[2] == "reset") {
        collection.deleteMany( {}, function(err, results) {
            console.log("Collection cleared");
       });
    } 
    
    var playerDefaultJson = [];
    //loops through 256 device IDs
    adding = true;
    for (var i = 0; i < 256; i++) {         
        playerDefaultJson.push({
            "device" : i,
            "online" : false
        });
    }
    collection.insert(playerDefaultJson, {w:1}, function(err, result) {
        console.log("Players collection set!");    
        process.exit();
    });
    
});

