const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema({

    CategoryId: {
        type: Schema.Types.ObjectId, ref:'Category'
    },
    ProductName: {
        type: String,
        required: true
    },
    Description: {
        type: String,
        required: true
    },
    PurchaseRate: {
        type: Number,
        required: true
    }
});

module.exports = Product = mongoose.model('Product', productSchema)