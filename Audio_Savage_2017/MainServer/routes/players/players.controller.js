(function() {
    'use strict';

    var Player = require('./players.model');

    //grab all players
    module.exports.getAll = function(req, res) { 
        Player.find({}, function (err, post) {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            res.json(post);
        });
    };
    
    //gets player by passed param device number
    module.exports.getByDevice = function(req, res) { 
        Player.find({"device" : req.params.device}, function (err, post) {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            res.json(post);
        });
    };
    
    //sets passed device param online 
    module.exports.setOnline = function(req, res) { 
        
        Player.findOneAndUpdate({"device" : req.params.device}, {
            $set: {
                "online": true
            }
        }, function(err, doc){
            if (err) {
                return res.send(500, { error: err });
            }            
            return res.send("succesfully saved"); 
        });
    };
    
    //sets passed device param offline
    module.exports.setOffline = function(req, res) {  
        
        Player.findOneAndUpdate({"device" : req.params.device}, {
            $set: {
                "online": false
            }
        }, function(err, doc){
            if (err) {
                return res.send(500, { error: err });
            }            
            return res.send("succesfully saved"); 
        });
    };
    
    //sets passed device param to postion in body
    module.exports.setPostion = function(req, res) {  
        
        Player.findOneAndUpdate({"device" : req.params.device}, {
            $set: {
                "x": req.body.x, "z" : req.body.z
            }
        }, function(err, doc){
            if (err) {
                return res.send(500, { error: err });
            }            
            return res.send("succesfully saved"); 
        });
    };
    
    //sets passed device param to mode in body
    module.exports.setMode = function(req, res) {
    
        Player.findOneAndUpdate({"device" : req.params.device}, {
            $set: {
                "mode": req.body.mode
            }
        }, function(err, doc){
            if (err) {
                return res.send(500, { error: err });
            }            
            return res.send("succesfully saved"); 
        });
    };
        
        
    
    
    
})();