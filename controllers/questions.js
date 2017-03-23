var express = require('express');
var router = express.Router();
var schema = require('../models/schema');

var noUser = {
  username: 'No User',
};

router.get('/', function(req, res, next) {

  if(req.user == null){
    req.user = noUser;
  }
  res.render('questions', {
    userName: req.user.username
  });
});

router.get('/create', function(req, res, next) {

  if(req.user == null){
    req.user = noUser;
  }
  res.render('createQuestion', {
    userName: req.user.username,
    csrfToken: req.csrfToken()
  })
});

router.get('/:id', function(req, res, next) {

  if(req.user == null){
    req.user = noUser;
  }
  res.render('editQuestion', {
    userName: req.user.username,
    questionID: req.params.id,
    csrfToken: req.csrfToken()
  })
});


router.post('/create', function(req, res) {

    // var params = {
    //     question: req.body.question,
    //     answer: req.body.answer,
    //     category: req.body.category,
    // };

    var newQuestion = new schema.Questions({
        question: req.body.question,
        answer: req.body.answer,
        category: req.body.category,
    }, console.log.bind(console, 'set up new user schema'));
    newQuestion.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('question created');
            res.redirect('/questions');
        }
    });
});



module.exports = router;
