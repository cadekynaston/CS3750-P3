var express = require('express');
var bcrypt = require('bcryptjs');
var schema = require('../models/schema');
var utils = require('./utils');   // has functions for creating user session
var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
var noUser = {
  username: 'No User'
};
/* GET register page. */
router.get('/create', function(req, res, next) {
  if(req.user == null){
    req.user = noUser;
  }
  res.render('create', { 
    userName: req.user.username,
    gameID: Math.random().toString(36).substr(2, 4).toUpperCase(),
    csrfToken: req.csrfToken() 
  });
});

/**
 * POST create from regisation form 
 * Create a new user account.
 * Once a user is logged in, they will be sent to the chat page.
 */
router.post('/create', function(req, res, next) {
  // create a new schema.User from the fields in the form 
  var user = new schema.User({
    username: req.body.username,
    gameID: req.body.gameID,
  });
  // create a new schema.Game 
  var game = new schema.Game({
    gameID: req.body.gameID,
    numPlayers: req.body.numPlayers,
    numRounds: req.body.numRounds,
    categories: {
      catname: true,
      catname: false,
    },
    players: {
      gameHost: req.body.username, 
      // players are added to this when they join
      
    },

  });
  //console.log(user); 
  user.save(function(err) {
    //check for errors
    if (err) {
      var error = 'Something bad happened! Please try again.';
      return next(err);
      res.render('create', { error: error });
    } else {
      game.save(function(err) {
        if(err){
          var error = 'Something bad happened! Please try again.';
          return next(err);
          res.render('create', { error: error });
        }
      });
      // if no errors we create a new user session and redirect to the chat
      utils.createUserSession(req, res, user);
      res.redirect('/game');
    }
  });
});

/* GET login page. */
router.get('/join', function(req, res, next) {
  if(req.user == null){
    req.user = noUser;
  }
  res.render('join', { 
    userName: req.user.username,
    csrfToken: req.csrfToken() 
  });
});


/**
 * POST login request
 * Log a user into their account.
 * Once a user is logged in, they will be sent to the dashboard page.
 */
router.post('/join', function(req, res) {
  // create a new schema.User from the fields in the form 
  var user = new schema.User({
    username: req.body.username,
    gameID: req.body.gameID,
  });
  user.save(function(err) {
    //check for errors
    if (err) {
      var error = 'Something bad happened! Please try again.';
      return next(err);
      res.render('join', { error: error });
    } else {
      // if no errors we create a new user session and redirect to the chat
      utils.createUserSession(req, res, user);
    }
  });
  // get a single user from their username entered on the webpage
  schema.Game.findOne({ gameID: req.body.gameID }, 'gameID', function(err, user) {
    // console.log(user);
    // cant find user redirect to login with error msg displayed
    if (!user) {
      res.render('join', { error: "gameID dose not exist", csrfToken: req.csrfToken() });
    } else {
      // if user found compare encrypted password to match
      if (req.body.gameID == user.gameID) {
        // if input is validated create a new user session and redirect to chat
        utils.createUserSession(req, res, user);
        res.redirect('/game');
      } else {
        // if password is wrong redirecct to login with error msg displayed
        res.render('join', { error: "gameID dose not exist", csrfToken: req.csrfToken() });
      }
    }
  });
});




module.exports = router;
