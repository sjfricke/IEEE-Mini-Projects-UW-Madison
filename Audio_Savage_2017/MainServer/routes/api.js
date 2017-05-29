(function() {
  'use strict';

  var express = require('express');
  var router = express.Router();

  router.use('/models', require('./models'));  
  router.use('/players', require('./players'));  

  module.exports = router;

})();

