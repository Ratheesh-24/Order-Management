const express = require('express');
const multer = require('multer');
const employeeRouter = express.Router();
const Employee = require('../models/Employee');
const Department = require('../models/Department');

//CRUD

// first upload image
//read
employeeRouter.get('/', (req, res) => {
    Employee.find()
        .select("_id EmployeeName DateOfBirth EmployeeAddress EmployeePhone ProfileImage")
        .populate('DepartmentId')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                employees: docs.map(doc => {
                    return {
                        _id: doc._id,
                        DepartmentId: doc.DepartmentId._id,
                        DepartmentName: doc.DepartmentId.DepartmentName,
                        EmployeeName: doc.EmployeeName,
                        DateOfBirth: doc.DateOfBirth,
                        EmployeeAddress: doc.EmployeeAddress,
                        EmployeePhone: doc.EmployeePhone,
                        ProfileImage: doc.ProfileImage
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
})

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        var filetype = '';
        if (file.mimetype === 'image/gif') {
            filetype = 'gif';
        }
        if (file.mimetype === 'image/png') {
            filetype = 'png';
        }
        if (file.mimetype === 'image/jpeg') {
            filetype = 'jpg';
        }
        cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});
var upload = multer({ storage: storage });

//create
employeeRouter.post('/', upload.single('file'), (req, res) => {

    const url = req.protocol + '://' + req.get('host') + '/uploads/';

    const employee = new Employee({
        DepartmentId: req.body.DepartmentId,
        EmployeeName: req.body.EmployeeName,
        DateOfBirth: req.body.DateOfBirth,
        EmployeeAddress: req.body.EmployeeAddress,
        EmployeePhone: req.body.EmployeePhone,
        ProfileImage: url + req.file.filename
    });

    employee.save((err, document) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to add Employee",
                    msgError: true
                }
            });
        else
            res.send(employee);
    });
});

// delete
employeeRouter.delete('/:id', (req, res) => {
    const employee = new Employee(req.body);
    Employee.findByIdAndDelete(req.params.id, err => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Delete Employee",
                    msgError: true
                }
            });
        else
            res.send(employee);
    });
});

//update 
employeeRouter.put('/:id', upload.single('file'), (req, res) => {

    //console.log(req.file.filename);

    const url = req.protocol + '://' + req.get('host') + '/uploads/';

    if (req.file) {
        var employee = {
            DepartmentId: req.body.DepartmentId,
            EmployeeName: req.body.EmployeeName,
            DateOfBirth: req.body.DateOfBirth,
            EmployeeAddress: req.body.EmployeeAddress,
            EmployeePhone: req.body.EmployeePhone,
            ProfileImage: url + req.file.filename
        }
    } else {
        var employee = {
            DepartmentId: req.body.DepartmentId,
            EmployeeName: req.body.EmployeeName,
            DateOfBirth: req.body.DateOfBirth,
            EmployeeAddress: req.body.EmployeeAddress,
            EmployeePhone: req.body.EmployeePhone
        }
    }

    Employee.findOneAndUpdate({ _id: req.params.id }, employee, { runValidators: true }, (err, response) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Update Employee",
                    msgError: true
                }
            });
        else
            res.send(response);
    });
});

module.exports = employeeRouter;