var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var noUser = {
    username: 'No User',
    gameCode: '0000'
  };

  if(req.user == null){
    req.user = noUser;
  }
  res.render('index', { 
    userName: req.user.username
  });
});

// router.get('/load', function(req, res, next) {
//   res.render('loading');
// });

module.exports = router;
