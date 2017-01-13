/* 
 * mangoose files db
 */


var mongoose = require('mongoose');

module.exports = mongoose.model('Chat',{
    user_id : 'string',
    name: 'String',
    message: 'String',
    room_id: 'String'

});