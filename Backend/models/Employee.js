const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const employeeSchema = new Schema({

    DepartmentId: {
        type: Schema.Types.ObjectId, ref:'Department'
    },
    EmployeeName: {
        type: String,
        required: true
    },
    DateOfBirth: {
        type: String
    },
    EmployeeAddress: {
        type: String,
        required: true
    },
    EmployeePhone: {
        type: String,
        required: true
    },
    ProfileImage: {
        type: String
    },

    
});

module.exports = Employee = mongoose.model('Employee', employeeSchema)