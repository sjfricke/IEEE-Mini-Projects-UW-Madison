/**
 * Created by SpencerFricke on 7/23/2016.
 */
var conn = new Mongo();
db = db.getSiblingDB('IEEE');

var cursor = db.Status.findOne( { "User": "Me" } );
    
