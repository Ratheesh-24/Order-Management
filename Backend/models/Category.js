const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const categorySchema = new Schema({
  CategoryName: {
    type: String,
    required: true
  }
})

module.exports = Category = mongoose.model('Category', categorySchema)