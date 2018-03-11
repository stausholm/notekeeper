const mongoose = require('mongoose');
const Schema = mongoose.Schema;




const documentSchema = new Schema({
  noteBody: {
    type: String,
    required: [true, 'Why would you want to store an empty note?']
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  },
  favorite: {
    type: Boolean,
    default: false
  }
});



const userSchema = new Schema({
  username: String,
  googleId: String,
  userDocuments: [documentSchema]
});



const User = mongoose.model('user', userSchema);

module.exports = User;
