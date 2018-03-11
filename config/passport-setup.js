const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user-model');

passport.serializeUser((user, done) => {
  // we only want to store the _id in a cookie
  done(null, user.id); // first param is error, second is _id for the user
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user); //pass the user found onto the next stage
  });
});


//what strategy will we use
passport.use(
  new GoogleStrategy({
    //options for the google strategy
    callbackURL: '/auth/google/redirect',
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret
  }, (accessToken, refreshToken, profile, done) => {
    // this is the passport callback function that is fired when passport sees the querystring after /google/redirect?code=, to exchange for profile info, that is then passed into the callback in the routehandler
    console.log('passport callback fired');
    console.log(profile);

    //check if user already exists in db
    User.findOne({googleId: profile.id}).then((currentUser) => {
      if(currentUser) {
        //user exists in db
        console.log('user is: ' + currentUser.username);
        done(null, currentUser); //move onto passport.serializeUser function
      } else {
        // user not found, create new user in db
        new User({
          username: profile.displayName,
          googleId: profile.id
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser.username);
          done(null, newUser); //move onto passport.serializeUser function
        })
      }
    })
  })
)
