const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const userSchema = new Schema({
  UserName: {
    type: String,
    required: true
  },
  UserPassword: {
    type: String,
    required: true
  },
  PasswordMatch: {
    type: String,
    required: true
  },
  Email: {
    type: String,
    required: true
  }

})

module.exports = User = mongoose.model('User', userSchema)