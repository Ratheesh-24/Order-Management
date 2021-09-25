const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const orderSchema = new Schema({

    CustomerId: {
        type: Schema.Types.ObjectId, ref:'Customer'
    },
    OrderAmount: {
        type: Number
    }
});

module.exports = Order = mongoose.model('Order', orderSchema)