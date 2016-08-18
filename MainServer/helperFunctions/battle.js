var _liveSpaces = require('./pokemonList');
var model_f = require('./model');
var player_f = require('./player');

module.exports = {

    //option during battle
    //returns (-1-invalid, 1-run, 2-died, 3-kill, 4-caught)
    option: function(player, optionValue, callback) {
                  
        var pokemon = model_f.getPokemonByName(player.mode.substr(1));
        
        switch(optionValue) {
            case 1: //small attack
                var attack = this.calculateAttack(player.baseAttack, pokemon.defence, 1);
                
                model_f.setHealth(pokemon.Name, pokemon.health - attack, attackCallback);
                
                break;
                
            case 2: //big attack
                var attack = this.calculateAttack(player.baseAttack, pokemon.defence, 2);
                
                model_f.setHealth(pokemon.Name, pokemon.health - attack, attackCallback);
                
                break;
                
            case 3: //run
                
                if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1) {
                    callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    
                    model_f.setOnlineStatus(pokemon.Name, true, function(result, err){                        
                        if (err) { callback(-1, "MongoDB on server was not able to update"); }
                        
                        callback( "You got away safely"); //ran away
                    })
                    
                }       
                
                break;
                
            case 4: //pokeball
                if (player.item.Pokeball <= 0) { callback("You are out of Pokeballs"); }
                
                if (this.calculateCatch(pokemon.health, pokemon.baseHealth, pokemon.catchFactor, 1)) {
                    
                    if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1 || player_f.updatePlayerList(device, "score", Math.floor(player.score + (pokemon.value)), "/updateScore") == -1 || player_f.updatePlayerList(device, "coins", Math.floor(player.coins + (pokemon.value)), "/updateCoins" || player_f.updatePlayerList(device, "item.Pokeball", player.item.Pokeball - 1), "/updateItem") == -1) {
                        callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        callback( "You caught " + pokemon.displayName + " and got " + (pokemon.value) + " coins!" );
                    }
                    
                } else {                    
                    callback("Aargh! Almost had it!");                    
                }
                
                break;
                
            case 5: //Greatball
                if (player.item.Greatball <= 0) { callback("You are out of Greatballs"); }
                
                if (this.calculateCatch(pokemon.health, pokemon.baseHealth, pokemon.catchFactor, 2)) {
                    
                    if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1 || player_f.updatePlayerList(device, "score", Math.floor(player.score + (pokemon.value)), "/updateScore") == -1 || player_f.updatePlayerList(device, "coins", Math.floor(player.coins + (pokemon.value)), "/updateCoins" || player_f.updatePlayerList(device, "item.Greatball", player.item.Greatball - 1), "/updateItem") == -1) {
                        callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        callback( "You caught " + pokemon.displayName + " and got " + (pokemon.value) + " coins!" );
                    }
                    
                } else {
                    callback("Aargh! Almost had it!");
                }
                break;
                
            case 6: //Ultraball
                if (player.item.Ultraball <= 0) { callback("You are out of Ultraballs"); }
                
                if (this.calculateCatch(pokemon.health, pokemon.baseHealth, pokemon.catchFactor, 3)) {
                    
                    if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1 || player_f.updatePlayerList(device, "score", Math.floor(player.score + (pokemon.value)), "/updateScore") == -1 || player_f.updatePlayerList(device, "coins", Math.floor(player.coins + (pokemon.value)), "/updateCoins" || player_f.updatePlayerList(device, "item.Ultraball", player.item.Ultraball - 1), "/updateItem") == -1) {
                        callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        callback( "You caught " + pokemon.displayName + " and got " + (pokemon.value) + " coins!" );
                    }
                    
                } else {
                    callback("Aargh! Almost had it!");
                }
                break;
                
            case 7: //potion
                if (player.item.Potion <= 0) { callback("You are out of Potions"); }
                
                
                var newHealth = player.health + 25;
                if (newHealth > 100) {newHealth = 100;}
                
                if (player_f.updatePlayerList(device, "health", newHealth, "/updateHealth"  == -1 || player_f.updatePlayerList(device, "item.Potion", player.item.Potion - 1), "/updateItem") == -1) {
                    callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    callback ( "You healed your health to " + newHealth + "with the Potion");
                }  
                break;
                
            case 8: //super potion
                if (player.item.SuperPotion <= 0) { callback("You are out of Super Potions"); }
                
                var newHealth = player.health + 50;
                if (newHealth > 100) {newHealth = 100;}
                
                if (player_f.updatePlayerList(device, "health", newHealth, "/updateHealth"  == -1 || player_f.updatePlayerList(device, "item.SuperPotion", player.item.SuperPotion - 1), "/updateItem") == -1) {
                    callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    callback ( "You healed your health to " + newHealth + "with the Super Potion");
                }  
                break;
        }
        
    },
    //firgures out the attack asserted and returns it
    calculateAttack: function (attack, defence, boost) {
        return ( (Math.random() * (attack / defence)) * (20 * boost) ) ;
    },

    //figures out if pokemon was caught and return true or false
    calculateCatch: function (health, baseHealth, catchFactor, boost) {

    }
};


function attackCallback(result, err) {
    if (err) { callback(-1, "MongoDB on server was not able to update"); }

    if (result.health <= 0) {
        //killed
        if (player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1 || player_f.updatePlayerList(device, "score", Math.floor(player.score + (pokemon.value * .25)), "/updateScore") == -1 || player_f.updatePlayerList(device, "coins", Math.floor(player.coins + (pokemon.value * .25)), "/updateCoins") == -1) {
            callback(-1, "MongoDB on Pi was not able to update");
        } else {
            callback( "You killed " + pokemon.displayName + " and got " + (pokemon.value * .25) + " coins" );
        }

    } else {
        //didn't kill
        var attackBack = this.calculateAttack(pokemon.attack, player.baseDefence, 1);
        if (player_f.updatePlayerList(device, "health", player.health - attackBack, "/updateHealth") == -1) {
            callback(-1, "MongoDB on Pi was not able to update");
        } else {

            if (player.health <= 0) {
                //dead
                if (player_f.updatePlayerList(device, "health", 100, "/updateHealth") == -1 || player_f.updatePlayerList(device, "mode", "0", "/updateMode") == -1) {
                    callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    callback("You passed out, when you woke up, " + pokemon.displayName + " got away");
                }

            } else {
                //normal attack and back
                callback("You did " + attack + " damage, but took " + attackBack + " damage and now only have " + player.health - attackBack + " health") ;
            }

        }
    }

}