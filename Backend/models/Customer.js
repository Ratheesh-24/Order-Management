const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const customerSchema = new Schema({
  CustomerName: {
    type: String,
    required: true
  }
})

module.exports = Customer = mongoose.model('Customer', customerSchema)