(function() {
  'use strict';

  var express = require('express');
  var controller = require('./players.controller')    
    
  var router = express.Router();

  router.get('/', controller.getAll);
  router.get('/device/:device', controller.getByDevice);
  router.get('/online/:device', controller.setOnline);
  router.get('/offline/:device', controller.setOffline);
  router.post('/position/:device', controller.setPostion);
  router.post('/mode/:device', controller.setMode);

  module.exports = router;

})();