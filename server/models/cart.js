const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartScheme = new Schema({
    productId: {
        type: String,
    },
    noOfItems: {
        type: Number
    },
    amount: {
        type: Number
    }
    
}, {timestamps: true });

 
module.exports = mongoose.model('cartModel', cartScheme);
