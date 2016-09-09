var _liveSpaces = require('./pokemonList');
var model_f = require('./model');
var player_f = require('./player');
var io = require('../sockets').get_io();

var battleExport = module.exports = {

    //option during battle
    //returns (-1-invalid, 1-run, 2-died, 3-kill, 4-caught)
    option: function(player, optionValue, callback) {
                  
        var pokemon = model_f.getPokemonByName(player.mode.substr(1));
        
        switch(optionValue) {
            case 1: //small attack
                var attack = Math.floor(this.calculateAttack(player.baseAttack, pokemon.defence, 1));
                
                model_f.setHealth(pokemon.Name, pokemon.health - attack, function(result, err) {
                    
                    if (err) { return callback(-1, "MongoDB on server was not able to update"); }

                    if (result.health <= 0) {
                        //killed
                        if (player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1 ||
                            player_f.updatePlayerList(player.device, "score", Math.floor(player.score + (pokemon.value * .25)), "/updateScore") == -1 || 
                            player_f.updatePlayerList(player.device, "coins", Math.floor(player.coins + (pokemon.value * .25)), "/updateCoins") == -1
                           ) {
                            return callback(-1, "MongoDB on Pi was not able to update");
                        } else {
                            //updates mode to all web viewers
                            io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                            return callback( "You killed " + pokemon.displayName + " and got " + Math.floor(pokemon.value * .25) + " coins" );
                        }

                    } else {
                        //didn't kill
                        var attackBack = battleExport.calculateAttack(pokemon.attack, player.baseDefence, 1);
                        if (player_f.updatePlayerList(player.device, "health", player.health - attackBack, "/updateHealth") == -1) {
                            return callback(-1, "MongoDB on Pi was not able to update");
                        } else {

                            if (player.health <= 0) {
                                //dead
                                if (player_f.updatePlayerList(player.device, "health", 100, "/updateHealth") == -1 ||
                                    player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1
                                   ) {
                                    return callback(-1, "MongoDB on Pi was not able to update");
                                } else {
                                    //updates mode to all web viewers
                                    io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                                    return callback("You passed out, when you woke up, " + pokemon.displayName + " got away");
                                }

                            } else {
                                //normal attack and back
                                return callback("You did " + attack + " damage, but took " + attackBack + " damage and now only have " + player.health - attackBack + " health") ;
                            }

                        }
                    }

                });
                
                break;
                
            case 2: //big attack
                var attack = Math.floor(this.calculateAttack(player.baseAttack, pokemon.defence, 2));
                
                model_f.setHealth(pokemon.Name, pokemon.health - attack, function(result, err) {
                    
                    if (err) { return callback(-1, "MongoDB on server was not able to update"); }

                    if (result.health <= 0) {
                        //killed
                        if (player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1 ||
                            player_f.updatePlayerList(player.device, "score", Math.floor(player.score + (pokemon.value * .25)), "/updateScore") == -1 ||
                            player_f.updatePlayerList(player.device, "coins", Math.floor(player.coins + (pokemon.value * .25)), "/updateCoins") == -1
                           ) {
                            return callback(-1, "MongoDB on Pi was not able to update");
                        } else {
                            //updates mode to all web viewers
                            io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                            return callback( "You killed " + pokemon.displayName + " and got " + Math.floor(pokemon.value * .25) + " coins" );
                        }

                    } else {
                        //didn't kill
                        var attackBack = battleExport.calculateAttack(pokemon.attack, player.baseDefence, 1);
                        if (player_f.updatePlayerList(player.device, "health", player.health - attackBack, "/updateHealth") == -1) {
                            return callback(-1, "MongoDB on Pi was not able to update");
                        } else {

                            if (player.health <= 0) {
                                //dead
                                if (player_f.updatePlayerList(player.device, "health", 100, "/updateHealth") == -1 ||
                                    player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1) {
                                    return callback(-1, "MongoDB on Pi was not able to update");
                                } else {
                                    //updates mode to all web viewers
                                    io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                                    return callback("You passed out, when you woke up, " + pokemon.displayName + " got away");
                                }

                            } else {
                                //normal attack and back
                                return callback("You did " + attack + " damage, but took " + attackBack + " damage and now only have " + player.health - attackBack + " health") ;
                            }

                        }
                    }

                });
                
                break;
                
            case 3: //run
                
                if (player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1) {
                    return callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    
                    //updates mode to all web viewers
                    io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                    
                    model_f.setOnlineStatus(pokemon.Name, true, function(result, err){                        
                        if (err) { return callback(-1, "MongoDB on server was not able to update"); }
                        
                        return callback( "You got away safely"); //ran away
                    })
                    
                }       
                
                break;
                
            case 4: //pokeball
                if (player.items.Pokeball <= 0) { return callback("You are out of Pokeballs"); }
                
                if (this.calculateCatch(pokemon.health, pokemon.baseHealth, pokemon.catchFactor, 1)) {
                    //caught
                    if (player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1 ||
                        player_f.updatePlayerList(player.device, "score", Math.floor(player.score + (pokemon.value)), "/updateScore") == -1 ||
                        player_f.updatePlayerList(player.device, "coins", Math.floor(player.coins + (pokemon.value)), "/updateCoins") == -1 ||
                        player_f.updatePlayerList(player.device, "items.Pokeball", player.items.Pokeball - 1, "/updateItem") == -1
                       ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        //updates mode to all web viewers
                        io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                        return callback( "You caught " + pokemon.displayName + " and got " + (pokemon.value) + " coins!" );
                    }
                    
                } else {   
                    //missed
                    if (player_f.updatePlayerList(player.device, "items.Pokeball", player.items.Pokeball - 1, "/updateItem") == -1) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback("Aargh! Almost had it!");   
                    }
                    
                                     
                }
                
                break;
                
            case 5: //Greatball
                if (player.items.Greatball <= 0) { return callback("You are out of Greatballs"); }
                
                if (this.calculateCatch(pokemon.health, pokemon.baseHealth, pokemon.catchFactor, 2)) {
                    
                    if (player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1 ||
                        player_f.updatePlayerList(player.device, "score", Math.floor(player.score + (pokemon.value)), "/updateScore") == -1 ||
                        player_f.updatePlayerList(player.device, "coins", Math.floor(player.coins + (pokemon.value)), "/updateCoins") == -1 ||
                        player_f.updatePlayerList(player.device, "items.Greatball", player.items.Greatball - 1, "/updateItem") == -1
                       ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        //updates mode to all web viewers
                        io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                        return callback( "You caught " + pokemon.displayName + " and got " + (pokemon.value) + " coins!" );
                    }
                    
                } else {
                    //missed
                    if (player_f.updatePlayerList(player.device, "items.Greatball", player.items.Greatball - 1, "/updateItem") == -1) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback("Aargh! Almost had it!");   
                    }
                }
                break;
                
            case 6: //Ultraball
                if (player.items.Ultraball <= 0) { return callback("You are out of Ultraballs"); }
                
                if (this.calculateCatch(pokemon.health, pokemon.baseHealth, pokemon.catchFactor, 3)) {
                    
                    if (player_f.updatePlayerList(player.device, "mode", "0", "/updateMode") == -1 ||
                        player_f.updatePlayerList(player.device, "score", Math.floor(player.score + (pokemon.value)), "/updateScore") == -1 ||
                        player_f.updatePlayerList(player.device, "coins", Math.floor(player.coins + (pokemon.value)), "/updateCoins") == -1 ||
                        player_f.updatePlayerList(player.device, "items.Ultraball", player.items.Ultraball - 1, "/updateItem") == -1
                       ) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        //updates mode to all web viewers
                        io.emit('modeUpdate', {"mode" : "0", "device" : player.device}); 
                        return callback( "You caught " + pokemon.displayName + " and got " + (pokemon.value) + " coins!" );
                    }
                    
                } else {
                    //missed
                    if (player_f.updatePlayerList(player.device, "items.Ultraball", player.items.Ultraball - 1, "/updateItem") == -1) {
                        return callback(-1, "MongoDB on Pi was not able to update");
                    } else {
                        return callback("Aargh! Almost had it!");   
                    }
                }
                break;
                
            case 7: //potion
                if (player.items.Potion <= 0) { return callback("You are out of Potions"); }
                
                var newHealth = player.health + 25;
                if (newHealth > 100) {newHealth = 100;}
                
                if (player_f.updatePlayerList(player.device, "health", newHealth, "/updateHealth")  == -1 ||
                    player_f.updatePlayerList(player.device, "items.Potion", player.items.Potion - 1, "/updateItem") == -1) {
                    return callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    return callback ( "You healed your health to " + newHealth + " with the Potion");
                }  
                break;
                
            case 8: //super potion
                if (player.items.SuperPotion <= 0) { return callback("You are out of Super Potions"); }
                
                var newHealth = player.health + 50;
                if (newHealth > 100) {newHealth = 100;}
                
                if (player_f.updatePlayerList(player.device, "health", newHealth, "/updateHealth")  == -1 ||
                    player_f.updatePlayerList(player.device, "items.SuperPotion", player.items.SuperPotion - 1, "/updateItem") == -1
                   ) {
                    return callback(-1, "MongoDB on Pi was not able to update");
                } else {
                    return callback ( "You healed your health to " + newHealth + " with the Super Potion");
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
        var value = (Math.random() * 100);
        var maxRange = ( (boost * 50) * (1.25 - ( health / baseHealth )) * catchFactor);
        console.log ("Random Generated: " + value );
        console.log ("Max Range Generated: " + maxRange );
        return ( value < maxRange );
    }
};


