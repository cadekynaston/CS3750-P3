var mongoose = require('mongoose');
var schema = mongoose.Schema;
var ObjectId = schema.ObjectId;

// The User model

module.exports.Users = mongoose.model('Users', new schema({
  id:           ObjectId,
  username:     { type: String, required: '{PATH} is required.'},
  gameCode:       {type: String, required: '{PATH} is required.' }
}));
module.exports.Questions = mongoose.model('Questions', new schema({
  id:           ObjectId,
  category:     { type: String, required: '{PATH} is required.'},
  answer:      {type: String, required: '{PATH} is required.' },
  question:     {type: String, required: '{PATH} is required.' }
}));
module.exports.Games = mongoose.model('Games', new schema({
  id:           ObjectId,
  gameCode:  { type: String, required: '{PATH} is required.'},
  players: { type: Object, required: '{PATH} is required.'},
  playerPoints: { type: Object, required: '{PATH} is required.'},
  winner: { type: String, required: '{PATH} is required.'},
  numQuestions: { type: Number, required: '{PATH} is required.'},
  round: { type: Object, required: '{PATH} is required.'},
  timeStamp: { type: Date, required: '{PATH} is required.'}
}));