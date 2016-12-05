/**
 * Created by Taha on 03/12/2016.
 */
var settings = require('../config/config');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
// var url_mon = 'mongodb://localhost:27017/test';

var http = require('http'),
    fs = require('fs'),
    url = require('url');

// var db = require('../db');

var mongo = require( '../db_mongo' );

http.createServer(function(request, response,db){
    var path = url.parse(request.url).pathname;
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
        var url_parts = url.parse(request.url, true);
        var query = url_parts.query;

    var setval = {id : 4,username: query.name, email: query.email, password: query.pass};
    //     db.query('INSERT INTO users  SET ?', setval, function (err, res) {
    //         if (err)
    //             throw err;
    //
    // });

console.log(setval);
    // if (mongo) {console.log("mongo  connected here ss");}
    // // The ../db_mongo.js file is now exporting a function that takes a callback; usage of the database has to happen inside that callback
    //     mongo(function(err, db){
    //         var userCollection =   db.collection('users');
    //         userCollection.insert((setval, function(err, result)
    //         {
    //             if(err) { throw err; }
    //             res.write("<p>Product inserted:</p>");
    //             res.end("<p>" + result[0].make + " " + result[0].model + "</p>");
    //         }));
    //     });




    var insertDocument = function(db, callback) {

        db.eval('getNextSequence(\'user_id\')', function(err, result) {

            db.collection('user').insertOne(
                {
                  id : result,  username : query.name, email: query.email, password: query.pass
                }
                , function(err, result) {
                assert.equal(err, null);
                console.log("row insterted ");
                callback();
            });
        });
    };

    MongoClient.connect(settings.mongourl, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        });
    });


}).listen(8001);