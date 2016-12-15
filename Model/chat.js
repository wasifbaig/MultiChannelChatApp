/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');

module.exports = mongoose.model('Chat',{
    user_id : 'string',
    name: 'String',
    message: 'String',
    room_id: 'String'

});