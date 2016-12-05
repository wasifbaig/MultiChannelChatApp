// // connect3.js
// var mongodb = require('mongodb');
// var MongoClient = mongodb.MongoClient;
// var url = 'mongodb://localhost:27017/test';
//
// module.exports = MongoClient.connect(url, function (err, db) {
//     if (err) {
//         console.log('Unable to connect to the mongoDB server. Error:', err);
//     } if(!err) {
//         console.log('Connection established to', url);
//         return db;
//     }
// });
//
// exports.findAll = function(req, res) {
//     var collection = req.db.collection('users');
//     collection.find().toArray(function (err, result) {
//         res.send(result);
//     });
// }

var records = [
    { id: 1, username: 'jack', password: 'secret', displayName: 'Jack', email: 'jack@example.com'  }
    , { id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', email: 'jill@example.com'  }
];


exports.findById = function(id, cb) {

    console.log("777");
    process.nextTick(function() {
        var idx = id - 1;
        console.log(records);
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + id + ' does not exist'));
        }
    });
};

exports.findByUsername = function(username, cb) {
    process.nextTick(function() {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === username) {
                return cb(null, record);
            }
        }
        return cb(null, null);
    });
};

exports.addUser = function(usr){
    records.push({
        id: records.length + 1,
        username: usr.username,
        password: usr.password,
        displayName: usr.displayName,
        email: usr.email
    })
    console.log(records);
};
