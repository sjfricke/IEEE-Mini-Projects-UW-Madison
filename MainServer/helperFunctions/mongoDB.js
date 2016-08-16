var assert = require('assert');
module.exports = {
    setOnline : function(db, device, callback) {
       db.collection('Players').updateOne(
          { "device" : device },
          {
            $set: { "online": true }
          }, function(err, results) {
          callback();
       });
    }, 
    getPlayerStatus: function(db, callback) {
        var foundList = [];
        var cursor = db.collection('Players').find( { "online" : true } ); 
       
        cursor.each(function(err, doc) {
          assert.equal(err, null);
            
          if (doc != null) {
             foundList.push(doc.device);
          } else {
             callback(foundList);
          }
       });
    }
}