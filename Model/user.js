/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    name : 'string',
    username: 'String',
    password: 'String'

});