var express = require('express');
var router = express.Router();
var schema = require('../models/schema');

var noUser = {
  username: 'No User',
};


router.get('/', function(req, res, next) {
  var questionsToPass;
  schema.Questions.find(function (err, q) {
    if (err) {
      res.render('questions', {
        error: 'Could not load questions'
      });
    } else {
      questionsToPass = q;
      console.log(questionsToPass)
      res.render('questions', {
        questions: questionsToPass
      });
    }
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


  // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
  schema.Questions.findOne({ '_id': req.params.id }, function (err, q) {
  if (err) return 'Error getting data';
  console.log(q);
  res.render('editQuestion', {
    userName: req.user.username,
    question: q,
    csrfToken: req.csrfToken()
  })
  })
  if(req.user == null){
    req.user = noUser;
  }

});

router.post('/create', function(req, res) {

    // var params = {
    //     question: req.body.question,
    //     answer: req.body.answer,
    //     category: req.body.category,
    // };

    console.log('hi')

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

router.post('/:id', function(req, res, next) {

  schema.Questions.findByIdAndUpdate(req.params.id, { $set: {
      question:req.body.question,
      answer: req.body.answer,
      category: req.body.category
    }}, function (err, q) {
      if (err) return handleError(err);
      res.redirect('/questions');
  });

});



module.exports = router;
