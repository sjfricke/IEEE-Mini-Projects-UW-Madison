var ModelSchema = require('.././routes/models/models.model');
var _liveSpaces = require('./pokemonList');

module.exports = {
    checkSpace : function(player, callback){ 
        ModelSchema.find({"position.x" : player.x, "position.z" : player.z}, function (err, post) {

            if (err) {
                console.error(err);
                callback(false, err);
            }

            if (post.length > 1) {
                console.log("~~~~~~~~~~~~\ncheckSpace: Two or more models found at this space\n~~~~~~~~~~~~\n");
                callback(post[0]);
            } else if (post.length < 0) {
                callback(1); //nothing found
            } else {
                callback(post[0]); //return the only one found
            }

        });
    }, 
    
    setOnlineStatus : function(pokemonName, status, callback) {
        
        ModelSchema.findOneAndUpdate({"Name" : pokemonName}, {
                $set: {
                    "online": status
                }
            },function (err, post) {

                if (err) {
                    console.error(err);
                    callback(false, err);
                }

                if (post.length > 1) {
                    console.log("~~~~~~~~~~~~\nsetOnlineStatus: Two or more models found at this space\n~~~~~~~~~~~~\n");
                    callback(post[0]);
                } else if (post.length < 0) {
                    callback(-1); //nothing found
                } else {
                    callback(post[0]); //return the only one found
                }

        });
    }, 
    
    setHealth : function(pokemonName, health, callback) {
        
        ModelSchema.findOneAndUpdate({"Name" : pokemonName}, {
                $set: {
                    "health": health
                }
            },function (err, post) {

                if (err) {
                    console.error(err);
                    callback(false, err);
                }

                if (post.length > 1) {
                    console.log("~~~~~~~~~~~~\nsetOnlineStatus: Two or more models found at this space\n~~~~~~~~~~~~\n");
                    callback(post[0]);
                } else if (post.length < 0) {
                    callback(-1); //nothing found
                } else {
                    callback(post[0]); //return the only one found
                }

        });
    }, 
    
    //returns the pokemon from pokemonList by name
    getPokemonByName : function(pokemonName){
        var returnPokemon = -1; //returns if nothing found
        
        _liveSpaces.pokemonList.forEach(function(element){
            if (element.Name == pokemonName) {
                returnPokemon = element;
            }
        });
        
        return returnPokemon;
    }
};