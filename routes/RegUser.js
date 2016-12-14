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


}).listen(1101);