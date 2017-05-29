(function() {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var PlayerSchema = new Schema({
        device: Number,
        online: Boolean,
        x: Number,
        z: Number,
        mode: Number        
    }, 
    { collection : 'Players' }
    );

module.exports = mongoose.model('Players', PlayerSchema);

})();