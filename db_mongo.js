var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var url_db = 'mongodb://localhost:27017/test';

module.exports = function(callback) {
    MongoClient.connect(url_db, callback);
};

//
// var mongoose = require('mongoose');
//
// module.exports = function(callback) {
//     mongoose.connect("mongodb://localhost/test");
// };


// var mongodb = require('mongodb');
// var MongoClient = mongodb.MongoClient;
// var url_db = 'mongodb://localhost:27017/test';
//
// exports.connectdb = function (callback) {
//
//     module.exports = MongoClient.connect(url_db, function (err, db) {
//         if (err) {
//             console.log('Unable to connect to the mongoDB server. Error:', err);
//         }
//         if (!err) {
//             console.log('Connection established to', url_db);
//             return db;
//         }
//     });
// }
// // module.exports = exports;
