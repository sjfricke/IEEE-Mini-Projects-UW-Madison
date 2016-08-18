var socket = io.connect();
socket.on('connect', function(data) { 
    $.get("/api/players/device/" + deviceID, function(result){
        var mode = result[0].mode;
        init(mode);
        animate();
    });
    //used to send socket device ID right away
    socket.emit('setSocketID', deviceID ); 
});

socket.on('movePlayer', function(data){
    console.log(data);
    movePlayer(data);
});

var container, stats;
var camera, scene, renderer, controls;
var lookAtScene = true;
var playerModel;

var _player = []; //live list of players
var _liveSpaces = []; //live list of spaces and their items

//animation loop
function animate() {

    requestAnimationFrame( animate );

    controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    
    render();

}

//render loop
function render() {

    camera.lookAt( playerModel.position ); //keeps camera aimed at player

    renderer.render( scene, camera );

}

//used to move player 
function movePlayer(direction) {
    
    switch(direction.toLowerCase()) {
        case "up":
            playerModel.position.z += 8;
            break;
        case "left":
            playerModel.position.x += 8;
            break;
        case "right":
            playerModel.position.x -= 8;
            break;
        case "down":
            playerModel.position.z -= 8;
            break;
    }
    
    controls.target = playerModel.position; //sets the aim of the orbit control
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

//returns element id of space (-1 for nothing)
function checkSpace(xPos, zPos) {
    _liveSpaces.forEach(function(element, index, array){
        if (xPos == element.x && zPos == element.z && element.live) {
            return element.ID;
        }
    });
    return -1;
}
                        
                    