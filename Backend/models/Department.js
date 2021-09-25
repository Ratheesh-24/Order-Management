const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const departmentSchema = new Schema({
  DepartmentName: {
    type: String,
    required: true
  }
})

module.exports = Department = mongoose.model('Department', departmentSchema)