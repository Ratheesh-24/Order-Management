const express = require('express');
const customerRouter = express.Router();
const Customer = require('../models/Customer');

//CRUD

//read
customerRouter.get('/',(req,res)=>{
    Customer.find({},(err,response)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to get Customer detail",
                msgError : true
            }});
        else{
            res.status(200).json({response});
        }
            
    });
});

//create
customerRouter.post('/',(req,res)=>{
    const cust = new Customer(req.body);
    //console.log(dept);
    cust.save((err,document)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to add Customer",
                msgError : true
            }});
        else
            res.send(cust);
            // res.status(200).json({message:{
            //     msgBody: "Successfully Added Customer",
            //     msgError : false
            // }});
    });
});

// delete
customerRouter.delete('/:id',(req,res)=>{
    const cust = new Customer(req.body);
    Customer.findByIdAndDelete(req.params.id,err=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to Delete Customer",
                msgError : true
            }});  
        else
            res.send(cust);
            // res.status(200).json({message:{
            //     msgBody: "Successfully Deleted Customer",
            //     msgError : false
            // }});     
    });
});

//update 
customerRouter.put('/:id',(req,res)=>{
    Customer.findOneAndUpdate({_id : req.params.id},req.body,{runValidators: true},(err,response)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to Update Customer",
                msgError : true
            }});
        else
            res.send(response);
        // res.status(200).json({message:{
        //     msgBody: "Successfully Updated Customer",
        //     msgError : false
        // }});   
    });
});

module.exports = customerRouter;