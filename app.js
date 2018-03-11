const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const authRoutes = require('./routes/auth-routes');
const keepRoutes = require('./routes/keep-routes');
const passportSetup = require('./config/passport-setup');

const app = express();

//set up view engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('public'));



app.use(cookieSession({
  maxAge: 24*60*60*1000, // 1 day //how long should the cookie to last. number is in milliseconds
  keys: [keys.session.cookieKey]
}));

//initialize passport
app.use(passport.initialize());
app.use(passport.session());



//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb');
});


//set up routes
app.use('/auth', authRoutes);
app.use('/keep', keepRoutes);


//home route
app.get('/', (req, res) => {
  if (!req.user) {
    res.render('index');
  } else {
    res.redirect('keep');
  }
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
