let express = require('express'),
    multer = require('multer'),
    mongoose = require('mongoose'),
    router = express.Router();
const fs = require('fs');
//var path =  require ("path") 

const DIR = './uploads/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + fileName)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    }
});

// User model
let Gallery = require('../models/Gallery');

router.post('/uploads', upload.single('profileImg'), (req, res, next) => {
    const url = req.protocol + '://' + req.get('host')

    const user = new Gallery({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        profileImg: url + '/uploads/' + req.file.filename
    });
    user.save().then(result => {
        res.status(201).json({
            message: "User registered successfully!",
            userCreated: {
                _id: result._id,
                profileImg: result.profileImg
            }
        })
    }).catch(err => {
        console.log(err),
            res.status(500).json({
                error: err
            });
    })
})

router.get("/", (req, res, next) => {
    Gallery.find().then(data => {
        res.status(200).json({
            message: "User list retrieved successfully!",
            users: data
        });
    });
});

// delete
router.delete('/:id', (req, res) => {
    const cat = new Gallery(req.body);
    Gallery.findByIdAndDelete(req.params.id,err=>{
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

module.exports = router;