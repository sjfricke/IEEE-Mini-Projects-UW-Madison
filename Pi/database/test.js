var internal_JSON = {
	
};


var conn = new Mongo();
db = db.getSiblingDB('IEEE');

db.createCollection("internal"); 
db.internal.insert(internal_JSON);
