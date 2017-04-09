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
  answer:      {type: String, required: '{PATH} is required.' },
  question:     {type: String, required: '{PATH} is required.' }
}));
module.exports.Game = mongoose.model('game', new schema({
  id:           ObjectId,
  game:     { type: Object, required: '{PATH} is required.'}
}));