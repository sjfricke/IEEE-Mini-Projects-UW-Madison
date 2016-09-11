
function init_battle() {    
   
    scene_battle = new THREE.Scene();

    //creates camera_battle and sets any default locations
    camera_battle = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight , 1, 10000 );    
    
//    camera_battle.position.x = 20;
    camera_battle.position.y = 3;
    camera_battle.position.z = -10;
    
    camera_battle.lookAt(new THREE.Vector3(0,0,0));
    
    // Lights
    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene_battle.add(ambientLight);
     
    //gtes player loaded
    var playerObject = loadList[0].clone(); //0 is the id for player model
        
    playerObject.name = "player" + deviceID;
    playerObject.position.set(3, -4, 0);
    playerObject.scale.set(.5, .5, .5);
    playerObject.rotation.set(0, -.3, 0);
    scene_battle.add( playerObject );
    
    playerModelBattle = scene_battle.getObjectByName("player" + deviceID); //gives name to find
    
}

//gets pokemon fighting loaded
function loadPokemon(pokemonName) {
    
    //removes pokemon if already there
    if (pokemonModelBattle != null) {
        scene_battle.remove(pokemonModelBattle);
    }
    
    $.get("/api/models/one/" + pokemonName, function(result){        
        
        var pokemonObject = loadList[result.pokemonID].clone(); //gets model data
        
        pokemonObject.name = result.Name;
        pokemonObject.position.set(-6, -2.5, 8);
        pokemonObject.scale.set(result.scale.x, result.scale.y, result.scale.z);
        pokemonObject.rotation.set(result.rotation.x, result.rotation.y - 3.9, result.rotation.z);
        
        //extra height for high scaled models
        if (result.scale.x > 5){
            pokemonObject.position.y += 2;
        } 
        
        //TODO figure out matrix rotation math instead of hot fixing
        if (result.rotation.x == 1.57) {
            pokemonObject.rotation.set(result.rotation.x, result.rotation.y , result.rotation.z + 3.9);
        }
        
        scene_battle.add( pokemonObject );

        pokemonModelBattle = scene_battle.getObjectByName(pokemonName); //gives name to find
        
        //gets health bar max and draws canvas again
        healthPokemon.maxHealth = result.baseHealth;
        healthPokemon.health = result.health;
        redrawHealthBar();
        
        
    }); //Get call
    
    
}
