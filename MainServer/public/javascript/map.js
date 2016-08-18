
function init(mode) {
    console.log(mode);
    //sets scene
    scene = new THREE.Scene();
    
    //makes full screen the scene
    container = document.createElement('div');
    document.body.appendChild( container );

    //creates camera and sets any default locations
    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight , 1, 10000 );    
    
    camera.position.x = 20;
    camera.position.y = 10;
    camera.position.z = 20;
    
    //sets the WebGL render
    renderer = new THREE.WebGLRenderer( { antialias: false } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.style.position = "relative";
    container.appendChild( renderer.domElement );

    renderer.setClearColor( 0xf0f0f0 );

    //sets up the orbit control so you can look around
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true; 
    controls.enablePan = false;    
   
    //functions for loaders
    var onProgress = function ( xhr ) { };
    var onError = function ( xhr ) { console.log(xhr); };    
    
    //player loader
    var player_mtlLoader = new THREE.MTLLoader();
    player_mtlLoader.setPath( '/models/' );
    player_mtlLoader.load( 'Player.mtl', function( materials ) {

        materials.preload();

        var player_objLoader = new THREE.OBJLoader();
        player_objLoader.setMaterials( materials );
        player_objLoader.setPath( '/models/' );
        player_objLoader.load( 'Player.obj', function ( object ) {
            
             object.name = "player";
        
        var startPos = randomPosition();
        object.position.set(startPos.x, 0, startPos.z);
        object.position.set(4, 0, 4);
        object.scale.set(.5, .5, .5);
        
        scene.add( object );
        playerModel = scene.getObjectByName("player"); //gives name to find
        controls.target = playerModel.position; //sets control to focus on it            

        }, onProgress, onError );

    });

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
    scene.add( line );

    //models loaded         
    function loadModel(p_name, p_position, p_scale, p_rotation, p_objFile, p_mtlFile){
        var mtlLoader = new THREE.MTLLoader();
        mtlLoader.setPath( '/models/' );
        mtlLoader.load( p_mtlFile, function( materials ) {

            materials.preload();

            var objLoader = new THREE.OBJLoader();
            objLoader.setMaterials( materials );
            objLoader.setPath( '/models/' );
            objLoader.load( p_objFile, function ( object ) {

                object.scale.set(p_scale.x, p_scale.y, p_scale.z);
                object.position.set(p_position.x, p_position.y, p_position.z);
                object.rotation.set(p_rotation.x, p_rotation.y, p_rotation.z);

                object.name = p_name;

                scene.add( object );

            }, onProgress, onError ); //objLoader

        }); //mtlLoader
    } //loadModel
    
    
    //gets the database and loads the models and sets local array of items
    $.get("/api/models", function(result){
        result.forEach(function(element, index, array){
            //loads if live
            if (element.live) {
                loadModel(element.Name, element.position, element.scale, element.rotation, element.objFile, element.mtlFile); 
            }
            
            //adds to local array list
            _liveSpaces.push({
                "name" : element.Name,
                "ID" : element.pokemonID,
                "x" : element.position.x,
                "z" : element.position.z,
                "live" : element.live
            }); 
           
        });
    });
    
    // Lights
    var ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add( ambientLight );
    
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
    var boxMesh = new THREE.Mesh( geometry_box, faceMaterial );
    boxMesh.position.y = 0;
    scene.add(boxMesh);
    

    //used for resizing of window to handle it
    window.addEventListener( 'resize', onWindowResize, false );
    function onWindowResize(){

        camera.setSize( window.innerWidth, window.innerHeight );
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );
    }

}
