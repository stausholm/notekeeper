const router = require('express').Router();
const bodyParser = require('body-parser');
const User = require('../models/user-model');
const readingTime = require('reading-time');

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
    res.send({thisDoc: doc, stats: readingTime(doc.noteBody)});
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
    doc.favorite = req.body.favorite;
    user.save().then((record) => {
      console.log('record updated: ' + record.userDocuments.id(req.params.thisDoc));
      //this returns the updated user without the updated record
      res.send(record);
    })
  })
});


// delete the user and all their data
router.delete('/', authCheck, (req, res) => {
  User.findByIdAndRemove({_id:req.user.id}).then((user) => {
    console.log('user deleted');
    res.send(user);
  })
});


module.exports = router;
