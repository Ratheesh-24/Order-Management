const express = require('express');
const departmentRouter = express.Router();
const Department = require('../models/Department');

//CRUD

//read
departmentRouter.get('/',(req,res)=>{
    Department.find({},(err,response)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to get department detail",
                msgError : true
            }});
        else{
            res.status(200).json({response});
        }
            
    });
});

//create
departmentRouter.post('/',(req,res)=>{
    const dept = new Department(req.body);
    //console.log(dept);
    dept.save((err,document)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to add Department",
                msgError : true
            }});
        else
            res.send(dept);
            // res.status(200).json({message:{
            //     msgBody: "Successfully Added Department",
            //     msgError : false
            // }});
    });
});

// delete
departmentRouter.delete('/:id',(req,res)=>{
    const dept = new Department(req.body);
    Department.findByIdAndDelete(req.params.id,err=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to Delete Department",
                msgError : true
            }});  
        else
            res.send(dept);
            // res.status(200).json({message:{
            //     msgBody: "Successfully Deleted Department",
            //     msgError : false
            // }});     
    });
});

//update 
departmentRouter.put('/:id',(req,res)=>{
    Department.findOneAndUpdate({_id : req.params.id},req.body,{runValidators: true},(err,response)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to Update Department",
                msgError : true
            }});
        else
            res.send(response);
        // res.status(200).json({message:{
        //     msgBody: "Successfully Updated Department",
        //     msgError : false
        // }});   
    });
});

module.exports = departmentRouter;