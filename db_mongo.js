var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url_db = 'mongodb://localhost:27017/test';

module.exports = function(callback) {
    MongoClient.connect(url_db, callback);
};
