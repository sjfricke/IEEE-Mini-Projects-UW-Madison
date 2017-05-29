
function init_map() {    
       
    scene_map = new THREE.Scene();
    
    //creates camera_map and sets any default locations
    camera_map = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight , 1, 10000 );
    camera_map.position.x = 20;
    camera_map.position.y = 10;
    camera_map.position.z = 20; 

    //sets up the orbit control so you can look around
    controls_map = new THREE.OrbitControls( camera_map, renderer.domElement );
    controls_map.enableDamping = true;
    controls_map.dampingFactor = 0.25;
    controls_map.enableZoom = true; 
    controls_map.enablePan = false;    
    
    // Lights
    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene_map.add(ambientLight);
    
    //skybox
    var textureLoader = new THREE.TextureLoader();
    
    var skybox0 = textureLoader.load( '/images/skybox_left.png' );
    var skybox1 = textureLoader.load( '/images/skybox_right.png' );
    var skybox2 = textureLoader.load( '/images/skybox_up.png' );
    var skybox3 = textureLoader.load( '/images/skybox_down.png' );
    var skybox4 = textureLoader.load( '/images/skybox_front.png' );
    var skybox5 = textureLoader.load( '/images/skybox_back.png' );
    
    var materials = [
        new THREE.MeshBasicMaterial( { map: skybox0, side : THREE.BackSide } ),
        new THREE.MeshBasicMaterial( { map: skybox1, side : THREE.BackSide } ),
        new THREE.MeshBasicMaterial( { map: skybox2, side : THREE.BackSide } ),
        new THREE.MeshBasicMaterial( { map: skybox3, side : THREE.BackSide } ),
        new THREE.MeshBasicMaterial( { map: skybox4, side : THREE.BackSide } ),
        new THREE.MeshBasicMaterial( { map: skybox5, side : THREE.BackSide } )
    ];
    
    var faceMaterial = new THREE.MeshFaceMaterial( materials );
    var geometry_box = new THREE.BoxGeometry( 3000, 3000, 3000 );
    skyboxMesh = new THREE.Mesh( geometry_box, faceMaterial );
    skyboxMesh.position.y = 0; 
    scene_map.add(skyboxMesh);
   
    // Grid
    var step = 1 * 8;
    var size = 32 * 8; //(gridLength/2) so -32 to 32

    var geometry = new THREE.Geometry();

    for ( var i = - size; i <= size; i += step ) {

        geometry.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geometry.vertices.push( new THREE.Vector3(   size, 0, i ) );

        geometry.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geometry.vertices.push( new THREE.Vector3( i, 0,   size ) );

    }

    var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

    var line = new THREE.LineSegments( geometry, material );
    scene_map.add( line );

    //load models
    _liveSpaces.forEach(function(element, index) {
        
        var modelMesh = loadList[element.pokemonID].clone(); 
        
        modelMesh.scale.set(element.scale.x, element.scale.y, element.scale.z);
        modelMesh.position.set(element.position.x, element.position.y, element.position.z);
        modelMesh.rotation.set(element.rotation.x, element.rotation.y, element.rotation.z);

        modelMesh.name = element.Name;
        
        //hides models that are not live
        if (!element.live) {
            modelMesh.visible = false;
        }
 
        scene_map.add( modelMesh );
        
    });
    
    //If server is in debug mode player data can be fake set
    //Used to no Pi to test with and want to work on front-end development
    if (debugMode) {
        _player = [
  {
    "_id": {
      "$oid": "57b139404c69c7b65351adb0"
    },
    "baseAttack": "50",
    "coins": 9,
    "device": 2,
    "health": 100,
    "items": {
      "Potion": 20,
      "SuperPotion": 2,
      "Pokeball": 18,
      "Greatball": 20,
      "Ultraball": 20
    },
    "mode": "2Charizard",
    "online": false,
    "score": 3559,
    "x": -4,
    "z": 44
  },
    {
    "_id": {
      "$oid": "57b139404c69c7b65351adb0"
    },
    "baseAttack": "50",
    "coins": 9,
    "device": 4,
    "health": 10,
    "items": {
      "Potion": 20,
      "SuperPotion": 2,
      "Pokeball": 18,
      "Greatball": 10,
      "Ultraball": 20
    },
    "mode": "0",
    "online": false,
    "score": 3559,
    "x": -20,
    "z": 52
  },
    {
    "_id": {
      "$oid": "57b139404c69c7b65351adb0"
    },
    "baseAttack": "50",
    "coins": 9,
    "device": 255,
    "health": 100,
    "items": {
      "Potion": 20,
      "SuperPotion": 2,
      "Pokeball": 18,
      "Greatball": 20,
      "Ultraball": 21
    },
    "mode": "1",
    "online": false,
    "score": 3559,
    "x": 20,
    "z": 52
  }
]
    }
    
    //load players
    _player.forEach(function(element) {
       
        //gets player model
        var object = loadList[0].clone(); //0 is the id for player model
        
        object.name = "player" + element.device;
        object.position.set(element.x, 0, element.z);
        object.scale.set(.5, .5, .5);
        scene_map.add( object );
        
        //adds name above player
        //space hack due to THREE.js r64 change to sprite alignment       
        var spritey = makeTextSprite( "                       Player " + element.device );
        spritey.name = "playerSprite" + element.device;
        spritey.position.set(element.x, 6,element.z );
        scene_map.add( spritey );
        
        //gets mode of this device player
        if (element.device == deviceID) {
            
            //this will allow us to move the sprite name with the player
            //spritey.name = "playerSprite"; 
            
            playerStats = element; //gathers player's inital stats
            updateStats(playerStats); //updates the canvas text
            
            var thisPlayerModeKey = element.mode.substring(0,1);
            if (thisPlayerModeKey == '2') { //battle
                sceneMode = 2;
                loadPokemon(element.mode.substring(1));
                setHUDLayout(1);
                
            } else if (thisPlayerModeKey == '1') { //store
                sceneMode = 1;            
                setHUDLayout(2); //store HUD
                
            } else if (thisPlayerModeKey == '0') { //normal
                sceneMode = 1;
                setHUDLayout(0); //clears HUD
            }
            
            
        }
        
    });
    
    playerModel = scene_map.getObjectByName("player" + deviceID); //gives name to find
    controls_map.target = playerModel.position; //sets control to focus on it   
    
    
}

//used to move player 
function movePlayer(xVal, zVal, objectName) {
    
    var modelMoving = scene_map.getObjectByName(objectName);
    
    var differenceX = modelMoving.position.x - xVal;
    var differenceZ = modelMoving.position.z - zVal;
    
    modelMoving.position.x = xVal;
    modelMoving.position.z = zVal;     
    
    if (modelMoving == playerModel) {
        controls_map.target = playerModel.position; //sets the aim of the orbit control for user player model
        camera_map.position.x -= differenceX;
        camera_map.position.z -= differenceZ;
    }
}
