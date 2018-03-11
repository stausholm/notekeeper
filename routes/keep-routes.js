const router = require('express').Router();
const bodyParser = require('body-parser');
const User = require('../models/user-model');

const jsonParser = bodyParser.json();

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/'); // /auth/login
  } else {
    // if logged in, just go to the next part
    next();
  }
}

router.get('/', authCheck, (req, res) => {
  res.render('keep', {user: req.user});
});

// router.post('/', authCheck, jsonParser, (req, res) => {
//   User.findByIdAndUpdate({_id: req.user.id}, req.body).then((updatedUser) => {
//     console.log('updated user');
//     res.send(updatedUser);
//   });
// });

router.get('/requestSpecificDocument/:thisDoc', authCheck, (req, res) => {
  User.findOne({_id: req.user.id}).then((user) => {
    var doc = user.userDocuments.id(req.params.thisDoc);
    res.send(doc);
  })
});


router.post('/', authCheck, jsonParser, (req, res) =>  {
  User.findOne({_id: req.user.id}).then((user) => {
    user.userDocuments.push(req.body);
    user.save().then((record) => {
      console.log('record added: ' + record);
      res.send(record);
    })
  })
});


router.delete('/requestSpecificDocument/:thisDoc', authCheck, (req, res) => {
  User.findOne({_id: req.user.id}).then((user) => {
    user.userDocuments.id(req.params.thisDoc).remove();
    user.save().then((record) => {
      console.log('record removed');
      //this returns the updated user without the removed record
      res.send(record);
    })
  })
});


router.put('/requestSpecificDocument/:thisDoc', authCheck, jsonParser, (req, res) => {
  User.findOne({_id: req.user.id}).then((user) => {
    var doc = user.userDocuments.id(req.params.thisDoc);
    doc.noteBody = req.body.noteBody;
    doc.updated = req.body.updated;
    user.save().then((record) => {
      console.log('record updated: ' + record);
      res.send(record);
    })
  })
});




module.exports = router;
