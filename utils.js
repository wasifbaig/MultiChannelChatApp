//MCCA FHKiel

var crypto = require('crypto')
  , type = require('component-type');
 // , Channel = require('./Model/channel');

/*
 * Restrict paths
 */

exports.restrict = function(req, res, next){
  if(req.isAuthenticated()) next();
  else res.redirect('/');
};

/*
 * Generates a URI Like key for a room
 */       

exports.genRoomKey = function() {
  var shasum = crypto.createHash('sha1');
  shasum.update(Date.now().toString());
  return shasum.digest('hex').substr(0,6);
};

/*
 * Room name is valid
 */

exports.validRoomName = function(req, res, fn) {
  req.body.room_name = req.body.room_name.trim();
  var nameLen = req.body.room_name.length;

  if(nameLen < 255 && nameLen >0) {
    fn();
  } else {
    res.redirect('back');
  }
};

/*
 * Checks if room exists
 */
exports.roomExists = function(req, res, client, fn) {
  client.hget('balloons:rooms:keys', encodeURIComponent(req.body.room_name), function(err, roomKey) {
    if(!err && roomKey) {
      res.redirect( '/' + roomKey );
    } else {
      fn()
    }
  });
};

/*
 * Creates a room
 */       
exports.createRoom = function(req, res, client) {
  
  console.log('create room');
  console.log(req.user);
  
  var roomKey = exports.genRoomKey()
    , room = {
        key: roomKey,
        name: req.body.room_name,
        admin: req.user.provider + ":" + req.user.username + ":" + req.user.userId,
        locked: 0,
        online: 0
      };


     //removed unrealated areas

  client.hmset('rooms:' + roomKey + ':info', room, function(err, ok) {
    if(!err && ok) {
      client.hset('balloons:rooms:keys', encodeURIComponent(req.body.room_name), roomKey);
      client.sadd('balloons:public:rooms', roomKey);
      res.redirect('/' + roomKey);
    } else {
      res.send(500);
    }
  });
};

/*
 * Get Room Info from main element
 */

exports.getRoomInfo = function(req, res, client, fn) { 
  client.hgetall('rooms:' + req.params.id + ':info', function(err, room) {
    if(!err && room && Object.keys(room).length) fn(room);
    else res.redirect('back');
  });
};

exports.getPublicRoomsInfo = function(client, fn) {
  client.smembers('balloons:public:rooms', function(err, publicRooms) {
    var rooms = []
      , len = publicRooms.length;
    if(!len) fn([]);

    publicRooms.sort(exports.caseInsensitiveSort);

    publicRooms.forEach(function(roomKey, index) {
      client.hgetall('rooms:' + roomKey + ':info', function(err, room) {
        // prevent for a room info 
        if(!err && room && Object.keys(room).length) {
          // add room info
          rooms.push({
            key: room.key || room.name, // tempr information
            name: room.name,
            online: room.online || 0
          });

          // check if last room
          if(rooms.length == len) fn(rooms);
        } else {
          // reduce check length at instant
          len -= 1;
        }
      });
    });
  });
};
/*
 * User get connected at homes
 */

exports.getUsersInRoom = function(req, res, client, room, fn) {
  client.smembers('rooms:' + req.params.id + ':online', function(err, online_users) {
    var users = [];


    online_users.forEach(function(userKey, index) {
      client.get('users:' + userKey + ':status', function(err, status) {
        
        console.log("getUsersInRoom function : " + userKey );
        
          var msnData = userKey.split(':')
          , profileLink = msnData[4]
          , userImg = msnData[3]
          , userId = msnData[2]
          , username = msnData[1]
          , provider = msnData[0];

        users.push({
            username: username ,
            provider: provider,
            status: status || 'available',
            userId : userId,
            userImg : userImg,
            profileLink : profileLink
            
        });
      });
    });

    console.log('GETuserInRoom');
    console.log(users);
    fn(users);

  });
};

/*
 * Get public rooms from 9ds
 */

exports.getPublicRooms = function(client, fn){
  client.smembers("balloons:public:rooms", function(err, rooms) {
    if (!err && rooms) fn(rooms);
    else fn([]);
  });
};
/*
 * Get User status from parsing file
 */

exports.getUserStatus = function(user, client, fn){
  client.get('users:' + user.provider + ":" + user.username + ":" + user.userId + ':status', function(err, status) {
    if (!err && status) fn(status);
    else fn('available');
  });
};


 // room enterance

exports.enterRoom = function(req, res, room, users, rooms, status){

  res.locals({
    room: room,
    rooms: rooms,
    user: {
      nickname: req.user.username,
      provider: req.user.provider,
      status: status
    },
    users_list: users
  });
  res.render('room');
};

/*
 * Sort Case Insensitive method calling
 */

exports.caseInsensitiveSort = function (a, b) { 
   var ret = 0;

   a = a.toLowerCase();
   b = b.toLowerCase();

   if(a > b) ret = 1;
   if(a < b) ret = -1; 

   return ret;
};



exports.merge = function merge(a, b) {
  for (var key in b) {
    if (exports.has.call(b, key) && b[key]) {
      if ('object' === type(b[key])) {
        if ('undefined' === type(a[key])) a[key] = {};
        exports.merge(a[key], b[key]);
      } else {
        a[key] = b[key];
      }
    }
  }
  return a;
};

exports.has = Object.prototype.hasOwnProperty;
