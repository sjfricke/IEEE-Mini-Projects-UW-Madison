// gets text canvas objects
var battleOptionCanvas = document.getElementById('battleOptions');
var storeOptionCanvas = document.getElementById('storeOptions');
var statsCanvas = document.getElementById('stats');

// setup canvas for demo
var healthCanvas = document.getElementById('healthBar');
healthCanvas.width = window.innerWidth;
healthCanvas.height = window.innerHeight;
var context = healthCanvas.getContext('2d');

//health objects for both the battle player model and pokemon model
var healthPokemon = {
    x: healthCanvas.width / 5 ,
    y: 30,
    width: 300,
    height: 20,
    health: 50,
    maxHealth: 85
};

var healthPlayer = {
    x: healthCanvas.width / 4 - 20,
    y: healthCanvas.height - 60,
    width: 300,
    height: 20,
    maxHealth: 100
};

// Render Loop
function redrawHealthBar() {
    
    // Clear the canvas
    healthCanvas.width = healthCanvas.width;
    
    // Calculate health bar percent
    var percentPokemon = healthPokemon.health / healthPokemon.maxHealth;
    var percentPlayer = playerStats.health / healthPlayer.maxHealth;
    
    //draws health boxs using 2D web canvas strats
    context.fillStyle = "black";
    context.fillRect(healthPokemon.x, healthPokemon.y, healthPokemon.width, healthPokemon.height);

    context.fillStyle = "red";
    context.fillRect(healthPokemon.x, healthPokemon.y, healthPokemon.width * percentPokemon, healthPokemon.height);
    
    context.fillStyle = "black";
    context.fillRect(healthPlayer.x, healthPlayer.y, healthPlayer.width, healthPlayer.height);

    context.fillStyle = "red";
    context.fillRect(healthPlayer.x, healthPlayer.y, healthPlayer.width * percentPlayer, healthPlayer.height);
}

//rotates through different canvas HUD layouts
function setHUDLayout(value) {
    
    switch(value) {
        case 0: //clear all 
            healthCanvas.style.visibility = "hidden";            
            battleOptionCanvas.style.visibility = "hidden";
            storeOptionCanvas.style.visibility = "hidden";
            break;
        case 1: //battle
            healthCanvas.style.visibility = "visible";    
            redrawHealthBar(); //draws healthCanvas once
            battleOptionCanvas.style.visibility = "visible";
            storeOptionCanvas.style.visibility = "hidden";
            break;
        case 2: //store
            healthCanvas.style.visibility = "hidden";            
            battleOptionCanvas.style.visibility = "hidden";
            storeOptionCanvas.style.visibility = "visible";
            break;
        case 3: //toggles stats
            if (statsCanvas.style.visibility == "hidden") {
                statsCanvas.style.visibility = "visible"
            } else {
                statsCanvas.style.visibility = "hidden"
            }
            
    }
    
}

//quick sloppy way of updating all personal player stats
function updateStats(statObject) {
    
    for (var key in statObject) {
        
        if (typeof(statObject[key]) == "object") {
            updateStats(statObject[key]); //some recursion here
        }
        
        if ( document.getElementById('stat_' + key) != null) {
            document.getElementById('stat_' + key).innerHTML = statObject[key];
        }
        
    }
}