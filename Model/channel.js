/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');

module.exports = mongoose.model('Channel',{
    name : 'string',
    user_id: 'String',
    key: 'string'

});