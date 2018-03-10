const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

const app = express();

//set up view engine
app.set('view engine', 'ejs');

//static files
app.use(express.static('public'));

//connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb');
});

//home route
app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
