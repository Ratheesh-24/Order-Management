const express = require('express');
const userRouter = express.Router();
const User = require('../models/User');


//create
userRouter.post('/create', (req, res) => {

    const user = new User(req.body);

    //console.log(user);
    user.save((err, document) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to add User",
                    msgError: true
                }
            });
        else
            res.send(user);
    });
});

// get user by email

userRouter.post('/search', (req, res) => {

    const obj = new User(req.body);

    User.findOne({
        Email: obj.Email
    })
        .then(user => {
            if (user) {
                res.send(user);
            }else{
                res.send('new');
            } 
        })
        .catch(err => console.log(err))

});


//login
userRouter.post('/login', (req, res) => {

    //console.log(req.body);

    User.findOne({
        Email: req.body.Email
    })
        .then(user => {
            if (user) {
                if (user.UserPassword == req.body.UserPassword) {
                    res.send(user);
                } else {
                    res.send("Not Authenticated user");
                }
            } else {
                res.send("User does not exist");
            }
        })
        .catch(err => console.log(err))

});



module.exports = userRouter;