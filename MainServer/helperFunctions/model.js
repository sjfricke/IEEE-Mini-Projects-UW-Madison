var ModelSchema = require('.././routes/models/models.model');
var _liveSpaces = require('./pokemonList');
var io = require('../sockets').get_io();

module.exports = {
    
    //function used to check model collection for a live pokemone
    checkSpace : function(player, callback){ 
        
        ModelSchema.find({"position.x" : player.x, "position.z" : player.z, "live" : true}, function (err, post) {

            if (err) {
                console.error(err);
                return callback(false, err);
            }

            if (post.length > 1) {
                console.log("~~~~~~~~~~~~\ncheckSpace: Two or more models found at this space\n~~~~~~~~~~~~\n");
                return callback(post[0]);
            } else if (post.length == 0) {
                return callback(1); //nothing found
            } else {
                return callback(post[0]); //return the only one found
            }

        });
    }, 
    
    //Allows to set the live status of any model
    setOnlineStatus : function(pokemonName, status, callback) {
        
        ModelSchema.findOneAndUpdate({"Name" : pokemonName}, {
                $set: {
                    "live": status
                }
            },function (err, post) {

                if (err) {
                    console.error(err);
                    return callback(false, err);
                } else {
                    return callback(post._doc); //findOneAndUpdate sends an object, not array
                }

        });
    }, 
    
    //Sets the health of pokemon
    setHealth : function(pokemonName, health, callback) {
        
        ModelSchema.findOneAndUpdate({"Name" : pokemonName}, {
                $set: {
                    "health": health
                }
            },function (err, post) {
            
                if (err) {
                    console.error(err);
                    return callback(false, err);
                } else {
                    return callback(post._doc); //findOneAndUpdate sends an object, not array
                }

        });
    }, 
    
    //returns the pokemon from pokemonList by name
    getPokemonByName : function(pokemonName, callback){
        
        ModelSchema.findOne({"Name" : pokemonName}, function (err, post) {

            if (err) {
                console.error(err);
                return callback(false, err);
            } else {
                return callback(post); //return the only one found
            }            

        });
        
    }
};