const router = require('express').Router();
const passport = require('passport');

//auth signout
router.get('/signout', (req, res) => {
  req.logout();
  res.redirect('/');
});


//auth with google
router.get('/google', passport.authenticate('google', { // tell passport that it should use the google strategy made in passport-setup.js
  scope: ['profile'] //specify what information we want to retrieve from the users google profile
}));

//callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res) => { //passport can see that there is a code in the querystring, so it wont redirect to the google consent screen, as it does in the route above
  // we now have access to the user on req.user
  res.redirect('/keep');
});

module.exports = router;
