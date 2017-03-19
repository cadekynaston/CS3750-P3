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
  username: ' ',
  gameCode: ' '
};
/* GET register page. */
router.get('/create', function(req, res, next) {
  if(req.user == null){
    req.user = noUser;
  }
  res.render('create', { 
    userName: req.user.username,
    gameCode: Math.random().toString(36).substr(2, 4).toUpperCase(),
    csrfToken: req.csrfToken() 
  });
});

/**
 * POST create from regisation form 
 * Create a new user account.
 * Once a user is logged in, they will be sent to the chat page.
 */
router.post('/create', function(req, res, next) {
  schema.User.findOne({ username: req.body.username }, function(err, user) {
    if(!user){
      // create a new schema.User from the fields in the form 
      var user = new schema.User({
        username: req.body.username,
        gameCode: req.body.gameCode,
      });
      //console.log(user); 
      user.save(function(err) {
        //check for errors
        if (err) {
          var error = 'Something bad happened! Please try again.';
          return next(err);
          res.render('create', { error: error });
        } else {
          // if no errors we create a new user session and redirect to the chat
          utils.createUserSession(req, res, user);
          res.redirect('/game');
        }
      });
    }else{
      schema.User.update({username: req.body.username,}, {
          gameCode: req.body.gameCode
      }, function(err, numberAffected, rawResponse) {
        //handle it
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
router.post('/join', function(req, res, next) {
  schema.User.findOne({ username: req.body.username }, function(err, user) {
    if(!user){
      // create a new schema.User from the fields in the form 
      var user = new schema.User({
        username: req.body.username,
        gameCode: req.body.gameCode,
      });
      //console.log(user); 
      user.save(function(err) {
        //check for errors
        if (err) {
          var error = 'Something bad happened! Please try again.';
          return next(err);
          res.render('create', { error: error });
        } else {
          // if no errors we create a new user session and redirect to the chat
          utils.createUserSession(req, res, user);
          res.redirect('/game');
        }
      });
    }else{
      schema.User.update({username: req.body.username,}, {
          gameCode: req.body.gameCode
      }, function(err, numberAffected, rawResponse) {
        //handle it
      });
      // if no errors we create a new user session and redirect to the chat
      utils.createUserSession(req, res, user);
      res.redirect('/game');
    }
  });
});




module.exports = router;
