var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';





var records = [
    { id: 1, username: 'testing',  password: 'testing', displayName: 'dani', email: 'dani@gmail.com'  }
  , { id: 2, username: 'taha',  password: 'test123', displayName: 'taha', email: 'taha@gmail.com'  }
];
var array = [];

var records_ = function(db, callback) {
    var cursor = db.collection('user').find( );
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
             // records = [  { id: 1, username: doc['username'],  password: doc['password'], displayName: doc['username'], email: doc['email']  }];
            records.push({ id: 1, username: doc['username'],  password: doc['password'], displayName: doc['username'], email: doc['email']  });
           // console.log(records);
        } else {
            callback();

        }
// console.log(records );
    });

}

exports.findById = function(id, cb) {


    var recc = MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        records_(db, function() {
            db.close();
        });
    });

    process.nextTick(function() {

        var recc = MongoClient.connect(url, function(err, db) {
            assert.equal(null, err);
            records_(db, function() {
                db.close();
            });
        });


        var idx = id - 1;
        // console.log(records);
        if (records[idx]) {
            // console.log(records[idx]);
            cb(null, records[idx]);
        } else {
            cb(null, 1);

        }
    });
};

exports.findByUsername = function(username, cb) {

    var recc = MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        records_(db, function() {
            db.close();
        });
    });
    // console.log(records);

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
