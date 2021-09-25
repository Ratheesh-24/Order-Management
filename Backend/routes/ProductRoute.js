const express = require('express');
const productRouter = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

//CRUD

//read
productRouter.get('/', (req, res) => {

   // console.log(req.body);

    Product.find()
        .select("_id ProductName Description PurchaseRate")
        .populate('CategoryId')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        _id: doc._id,
                        CategoryId: doc.CategoryId._id,
                        CategoryName: doc.CategoryId.CategoryName,
                        ProductName: doc.ProductName,
                        Description: doc.Description,
                        PurchaseRate: doc.PurchaseRate
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


//create
productRouter.post('/', (req, res) => {

    const product = new Product(req.body);

    product.save((err, document) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to add Product",
                    msgError: true
                }
            });
        else
            res.send(product);
    });
});

// delete
productRouter.delete('/:id', (req, res) => {
    const product = new Product(req.body);
    Product.findByIdAndDelete(req.params.id, err => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Delete Product",
                    msgError: true
                }
            });
        else
            res.send(product);
    });
});

//update 
productRouter.put('/:id', (req, res) => {
    Product.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true }, (err, response) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Update Product",
                    msgError: true
                }
            });
        else
            res.send(response);
    });
});

module.exports = productRouter;