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
      res.render('questions', {
        questions: questionsToPass
      });
    }
  });
});

router.get('/create', function(req, res, next) {
  schema.Questions.find().distinct('category', function(error, ids) {
      console.log('found categories');
      res.render('createQuestion', {
        categories: ids,
        csrfToken: req.csrfToken()
      })
  });
});

router.get('/:id', function(req, res, next) {

  schema.Questions.findOne({ '_id': req.params.id }, function (err, q) {
    if (err) return 'Error getting data';
    schema.Questions.find().distinct('category', function(error, ids) {
        console.log('found categories');
        res.render('editQuestion', {
          categories: ids,
          question: q,
          csrfToken: req.csrfToken()
      });
    })
  })
});

router.post('/create', function(req, res) {

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
