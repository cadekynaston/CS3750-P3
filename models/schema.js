var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// The User model
module.exports.User = mongoose.model('User', new schema({
  id:           ObjectId,
  username:     { type: String, required: '{PATH} is required.'},
  gameCode:       {type: String, required: '{PATH} is required.' }
}));
module.exports.Categories = mongoose.model('Categories', new schema({
  id:           ObjectId,
  category:     { type: String, required: '{PATH} is required.'},
}));
module.exports.Questions = mongoose.model('Questions', new schema({
  id:           ObjectId,
  category:     { type: String, required: '{PATH} is required.'},
  answers:      {type: String, required: '{PATH} is required.' },
  question:     {type: String, required: '{PATH} is required.' }
}));