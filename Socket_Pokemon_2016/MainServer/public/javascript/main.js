/*
    GLOBALS
*/
var container, stats;
var scene, renderer;
var lookAtScene = true;
var playerModel;  
var playerModelBattle, pokemonModelBattle;
var playerStats;
var skyboxMesh; 

//1 = map
//2 = battle
var sceneMode = 1; //set when player is loaded in map_scene.js

var camera_map, controls_map;

var scene_map, scene_battle;

var _player = []; //live list of players
var _liveSpaces = []; //live list of spaces and their items
var loadList = {}; //keeps track of loaded models

//animation loop
function animate() {

    requestAnimationFrame( animate );    
    
    render();

}

//render loop
function render() {

    if (sceneMode == 1){
        //map render
        camera_map.lookAt( playerModel.position ); //keeps camera aimed at player
        controls_map.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
        renderer.render( scene_map, camera_map );
    } else {
        //battle render
//        camera_battle.lookAt( playerModel.position ); //keeps camera aimed at player
//        controls_battle.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
        renderer.render( scene_battle, camera_battle );
    }

}

//returns THREE.Vec3 where x and z are random, y is 0
function randomPosition() {
    var ranX = Math.floor(Math.random() * gridLength); //between 0 and gridlength 
    var ranZ = Math.floor(Math.random() * gridLength); //between 0 and gridlength 
    
    // ( (x-(gridLength/2)) * squareSize ) + squareSize/2
    ranX = ( (ranX - 32) * 8 ) + 4;
    ranZ = ( (ranZ - 32) * 8 ) + 4;
    return new THREE.Vector3(ranX, 0, ranZ);
}

//Makes sure all the models are loaded once before continuing
function initModel() {
    //async counter to know when last one is loaded
    var loadingCount = 0, loadedCount = 0, loadingReady = false;
    
    //player model not in model databas call    
    loadModel(0, 'Player.obj', 'Player.mtl', doneLoading);
    loadingCount++;
    
    //gets the database and loads the models and sets local array of items
    $.get("/api/models", function(result){
        
        result.forEach(function(element, index, array){
            
            //only loads if not yet to prevent duplicate loading wait
            if (!isLoaded(element.pokemonID)) {
                
                loadList[element.pokemonID] = {}; //need filler to show its being loaded
                
                loadModel(element.pokemonID, element.objFile, element.mtlFile, doneLoading); 
                
                loadingCount++;
            }            
            
        }); //result.foreach        
        
        //adds to local array list        
        _liveSpaces = result;
        
        loadingReady = true; //all models sent to be loaded
        
    }); //Get call
 
    
    //checks for loaded model
    function isLoaded(pokemonID) {
        
        for(loadedPokemon in loadList) {

            if (parseInt(loadedPokemon) == parseInt(pokemonID)) {
                return true; //found
            }
        }
        return false; //not found
    }
    //checks for last model to load and kicks off init() if is
    function doneLoading() {        
        loadedCount++;
        if (loadingCount == loadedCount && loadingReady) {
            init();
        } 
    }
} 

function init(){  
        
    //makes full screen the scene
    container = document.getElementById('mainCanvas');
//    container = document.createElement('div');
    document.body.appendChild( container );
    
    //sets the WebGL render - both scenes use it
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = "relative";
    container.appendChild( renderer.domElement );
    renderer.setClearColor( 0xf0f0f0 );
        
    
    //gets list of players
    //init scenes after loaded
    $.get("/getPlayers/all", function(result){
        //TODO right now only will grab players online when page loads
        _player = result;
        
        init_map();
        init_battle();
        
    }); //Get call
    
    animate();
}

//used for resizing of window to handle it
window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){

    if (sceneMode == 1){ 
        camera_map.aspect = window.innerWidth / window.innerHeight;
        camera_map.updateProjectionMatrix();
    } else { 
        camera_battle.aspect = window.innerWidth / window.innerHeight;
        camera_battle.updateProjectionMatrix();
    }
    

    renderer.setSize( window.innerWidth, window.innerHeight );    
}
                    
//functions for loaders
var onProgress = function ( xhr ) { };
var onError = function ( xhr ) { console.log(xhr); };  

//models loaded         
//function loadModel(p_name, p_position, p_scale, p_rotation, p_objFile, p_mtlFile){
function loadModel(p_id, p_objFile, p_mtlFile, callback){
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.setPath( '/models/' );
    mtlLoader.load( p_mtlFile, function( materials ) {

        materials.preload();

        var objLoader = new THREE.OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( '/models/' );
        objLoader.load( p_objFile, function ( object ) {            

            loadList[p_id] = object;
            callback()

        }, onProgress, onError ); //objLoader

    }); //mtlLoader
} //loadModel

//lets users see stats with keyboard
window.addEventListener('keydown', function(e){
    if (e.keyCode == 88) { //x
        setHUDLayout(3); //toggles stats screen        
    }
});

//makes spirit boxes above players
//taken from a pre r64 example, modified to work :)
function makeTextSprite( message, space ){
	var parameters = {};	
    var spaceHack = space || 103;
	var fontface = "Arial";	
	var fontsize = 18;	
	var borderThickness =  4;	
	var borderColor =  { r:0, g:0, b:0, a:1.0 };	
	var backgroundColor =  { r:255, g:255, b:255, a:1.0 };	
		
	var canvas = document.createElement('canvas');
	var context = canvas.getContext('2d');
	context.font = "Bold " + fontsize + "px " + fontface;
    
	// get size data (height depends only on font size)
	var metrics = context.measureText( message );
	var textWidth = metrics.width/2;
	
	// background color
	context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
								  + backgroundColor.b + "," + backgroundColor.a + ")";
	// border color
	context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
								  + borderColor.b + "," + borderColor.a + ")";
	context.lineWidth = borderThickness;
    roundRect(context, borderThickness/2 + 103, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
	// 1.4 is extra height factor for text below baseline: g,j,p,q.
	
	// text color
	context.fillStyle = "rgba(0, 0, 0, 1.0)";
	context.fillText( message, borderThickness, fontsize + borderThickness);
	
	// canvas contents will be used for a texture
	var texture = new THREE.Texture(canvas) 
	texture.needsUpdate = true;
	var spriteMaterial = new THREE.SpriteMaterial( { map: texture } );
	var sprite = new THREE.Sprite( spriteMaterial );
	sprite.scale.set(10,5,1.0);
	return sprite;	
}

// function for drawing rounded rectangles
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
    ctx.fill();
	ctx.stroke();   
}


