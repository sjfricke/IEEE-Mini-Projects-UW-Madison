(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ModelSchema = new Schema({
        Name: String,
        displayName: String,
        pokemonID: Number,
        health: Number,
        baseHealth: Number,
        attack: Number,
        defence: Number,
        position: {},
        scale: {},
        rotation: {},
        objFile: String,
        mtlFile: String,
        value: Number,
        live: Boolean,
        catchFactor: Number
        
    }, 
    { collection : 'Models' }
    );

module.exports = mongoose.model('Models', ModelSchema);

})();