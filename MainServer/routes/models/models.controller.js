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
    
    //gets one by name
    module.exports.getOne = function(req, res) { 
        Model.findOne({ "Name" : req.params.name }, function (err, post) {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            res.json(post);
        });
    };    
    
    
    
    
})();