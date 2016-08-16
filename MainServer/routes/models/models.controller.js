(function() {
    'use strict';

    var Model = require('./models.model');

    //grab all for display
    module.exports.getAll = function(req, res) { 
        Model.find({}, function (err, post) {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            res.json(post);
        });
    };
    
        
    
    
    
})();