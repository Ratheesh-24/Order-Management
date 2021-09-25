const express = require('express');
const categoryRouter = express.Router();
const Category = require('../models/Category');

//CRUD

//read
categoryRouter.get('/',(req,res)=>{
    Category.find({},(err,response)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to get category detail",
                msgError : true
            }});
        else{
            res.status(200).json({response});
        }
            
    });
});

//create
categoryRouter.post('/',(req,res)=>{
    const cat = new Category(req.body);
    //console.log(dept);
    cat.save((err,document)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to add Category",
                msgError : true
            }});
        else
            res.send(cat);
            // res.status(200).json({message:{
            //     msgBody: "Successfully Added Category",
            //     msgError : false
            // }});
    });
});

// delete
categoryRouter.delete('/:id',(req,res)=>{
    const cat = new Category(req.body);
    Category.findByIdAndDelete(req.params.id,err=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to Delete Category",
                msgError : true
            }});  
        else
            res.send(cat);
            // res.status(200).json({message:{
            //     msgBody: "Successfully Deleted Category",
            //     msgError : false
            // }});     
    });
});

//update 
categoryRouter.put('/:id',(req,res)=>{
    Category.findOneAndUpdate({_id : req.params.id},req.body,{runValidators: true},(err,response)=>{
        if(err)
            res.status(500).json({message:{
                msgBody : "Unable to Update Category",
                msgError : true
            }});
        else
            res.send(response);
        // res.status(200).json({message:{
        //     msgBody: "Successfully Updated Category",
        //     msgError : false
        // }});   
    });
});

module.exports = categoryRouter;