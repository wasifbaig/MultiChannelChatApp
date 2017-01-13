/* 
 Moongose channel stoorage
 */


var mongoose = require('mongoose');

module.exports = mongoose.model('Channel',{
    name : 'string',
    user_id: 'String',
    key: 'string'

});