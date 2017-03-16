var express = require('express');
var router = express.Router();
var utils = require('./utils');

/* GET game page. */
router.get('/', function(req, res, next) {
  var noUser = {
    username: 'No User',
    gameID: ''
  };

  if(req.user == null){
    req.user = noUser;
  }
  res.render('game', { 
    userName: req.user.username,
    gameID: req.user.gameID
  });
});
router.get('/join', function(req, res, next) {
    var noUser = {
    username: 'No User'
  };

  if(req.user == null){
    req.user = noUser;
  }

  res.render('JoinGame', { 
    userName: req.user.username,
    gameID: Math.random().toString(36).substr(2, 4).toUpperCase()
  });
});
router.get('/create', function(req, res, next) {
    var noUser = {
    username: 'No User',
  };

  if(req.user == null){
    req.user = noUser;
  }

  res.render('JoinGame', { 
    userName: req.user.username,
    gameID: Math.random().toString(36).substr(2, 4).toUpperCase()
  });
});
module.exports = router;
