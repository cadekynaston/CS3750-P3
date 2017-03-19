var express = require('express');
var router = express.Router();
var utils = require('./utils');

/* GET game page. */
router.get('/', utils.requireLogin, function(req, res, next) {
  console.log(req.user);
  res.render('game', { 
    userName: req.user.username,
    gameCode: req.user.gameCode,
    csrfToken: req.csrfToken()
  });
});
// Moved to users page for proper login 
// router.get('/join', function(req, res, next) {
//     var noUser = {
//     username: 'No User'
//   };

//   if(req.user == null){
//     req.user = noUser;
//   }

//   res.render('joinGame', { 
//     userName: req.user.username,
//     gameCode: Math.random().toString(36).substr(2, 4).toUpperCase()
//   });
// });
// router.get('/create', function(req, res, next) {
//     var noUser = {
//     username: 'No User',
//   };

//   if(req.user == null){
//     req.user = noUser;
//   }

//   res.render('create', { 
//     userName: req.user.username,
//     gameCode: Math.random().toString(36).substr(2, 4).toUpperCase()
//   });
// });
module.exports = router;
