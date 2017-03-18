var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// The User model
module.exports.User = mongoose.model('User', new schema({
  id:           ObjectId,
  username:     { type: String, required: '{PATH} is required.'},
  gameCode:       {type: String, required: '{PATH} is required.' }
}));
