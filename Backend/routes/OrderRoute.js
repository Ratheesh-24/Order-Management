const express = require('express');
const OrderRouter = express.Router();
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const OrderDetail = require('../models/OderDetail');

//CRUD

//read
OrderRouter.get('/', (req, res) => {

    //console.log(req.body);

    Order.find()
        .select("_id OrderAmount")
        .populate('CustomerId')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                Orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        CustomerId: doc.CustomerId._id,
                        CustomerName: doc.CustomerId.CustomerName,
                        OrderAmount: doc.OrderAmount
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
OrderRouter.post('/', (req, res) => {

    const order = new Order(req.body);

    order.save((err, document) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to add Order",
                    msgError: true
                }
            });
        else
            res.send(order);
    });
});

//update 
OrderRouter.put('/:id', (req, res) => {
    Order.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true }, (err, response) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Update Order",
                    msgError: true
                }
            });
        else
            res.send(response);
    });
});

// delete
OrderRouter.delete('/:id', (req, res) => {
    const product = new Product(req.body);
    Order.findByIdAndDelete(req.params.id, err => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Delete Order",
                    msgError: true
                }
            });
        else
            res.send(product);
    });
});


// for order items

//read
OrderRouter.get('/orderdetails/:id', (req, res) => {
    
    //console.log(req.params.id);
    
    const order_id = req.params.id;

    //console.log(order_id);

    OrderDetail.find({OrderId: order_id})
        .populate('ProdId')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                Orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        ProdId: doc.ProdId._id,
                        ProductName: doc.ProdId.ProductName,
                        Qty: doc.Qty,
                        Rate: doc.Rate,
                        Amount: doc.Amount
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
OrderRouter.post('/orderdetails', (req, res) => {

    const orderitems = new OrderDetail(req.body);
    console.log(orderitems);

    orderitems.save((err, document) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to add Order Items",
                    msgError: true
                }
            });
        else{
            //console.log(orderitems);
            res.send(orderitems);
        }
            
    });
});

//update 
OrderRouter.put('/orderdetails/:id', (req, res) => {
    OrderDetail.findOneAndUpdate({ _id: req.params.id }, req.body, { runValidators: true }, (err, response) => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Update Order Items",
                    msgError: true
                }
            });
        else
            res.send(response);
    });
});

// delete order items
OrderRouter.delete('/orderdetails/:id', (req, res) => {
    
    const orderitems = new OrderDetail(req.body);
    
    OrderDetail.findByIdAndDelete(req.params.id, err => {
        if (err)
            res.status(500).json({
                message: {
                    msgBody: "Unable to Delete Order Items",
                    msgError: true
                }
            });
        else
            res.send(orderitems);
    });
});


module.exports = OrderRouter;