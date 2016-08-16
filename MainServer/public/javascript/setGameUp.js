var pokemonArray = [];
var gridLength = 64;

function init() {
    var pokemonLoader = new THREE.ColladaLoader();
    pokemonLoader.load('/models/Mewtwo.dae', function ( collada ) {
        for (var i = 0; i < 10; i++){
            collada.scene.name = "pokemon" + i;

            var startPos = randomPosition();
            collada.scene.position.set(startPos.x, 0, startPos.z);
            pokemonArray.push(collada.scene);
        }
        
       // console.log(JSON.stringify(pokemonArray[0]))
//        var url = 'data:text/json;charset=utf8,' + encodeURIComponent(JSON.stringify(pokemonArray[0]));
//        window.open(url, '_blank');
//        window.focus();

         $.post("/loadPokemon", {"pokemonData": pokemonArray[0]}, function(result){
            console.log(result);
        });
    });
    
    

}

//returns THREE.Vec3 where x and z are random, y is 0
function randomPosition() {
    var ranX = Math.floor(Math.random() * gridLength); //between 0 and gridlength 
    var ranZ = Math.floor(Math.random() * gridLength); //between 0 and gridlength 
    
    // ( (x-(gridLength/2)) * squareSize ) + squareSize/2
    ranX = ( (ranX - (gridLength/2)) * 4 ) + 2;
    ranZ = ( (ranZ - (gridLength/2)) * 4 ) + 2;
    return new THREE.Vector3(ranX, 0, ranZ);
}

init();
