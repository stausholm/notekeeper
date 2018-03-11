const router = require('express').Router();
const bodyParser = require('body-parser');
const User = require('../models/user-model');

const jsonParser = bodyParser.json();

const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/auth/login');
  } else {
    // if logged in, just go to the next part
    next();
  }
}

router.get('/', authCheck, (req, res) => {
  res.render('keep', {user: req.user});
});


module.exports = router;
