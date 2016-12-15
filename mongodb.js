

module.exports = mongodb;


function mongodb(app){

// Retrieve
var MongoClient = require('mongodb').MongoClient;
var database = 'MCCA';

// Connect to the db
MongoClient.connect("mongodb://localhost:27017/"+database, function(err, db) {
  if(!err) {
    console.log("MongoDB is connected");
    
    db.createCollection('users', function(err, collection) {});
    req.session.db = db;
    
  }
  else
      {
          console.log("MongoDB Connection Error");
      }
  
});



}