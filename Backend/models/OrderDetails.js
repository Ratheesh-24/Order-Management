const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const ordDetailSchema = new Schema({

    OrderId: {
        type: Schema.Types.ObjectId, ref:'Order'
    },
    ProdId: {
        type: Schema.Types.ObjectId, ref:'Product'
    },
    Qty: {
        type: Number,
        required: true
    },
    Rate: {
        type: Number
    },
    Amount: {
        type: Number   }
});

module.exports = OrderDetail = mongoose.model('OrderDetail', ordDetailSchema)