(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var ModelSchema = new Schema({
        Name: String,
        pokemonID: Number,
        health: Number,
        attack: Number,
        defence: Number,
        position: {},
        scale: {},
        rotation: {},
        objFile: String,
        mtlFile: String,
        value: Number
        
    }, 
    { collection : 'Models' }
    );

module.exports = mongoose.model('Models', ModelSchema);

})();