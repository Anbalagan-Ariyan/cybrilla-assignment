const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productScheme = new Schema({
    productId : {
        type: String
    },
    productName: {
        type: String,
        trim: true
    },
    productPrice: {
        type: Number,
    }
    
}, {timestamps: true });

 
module.exports = mongoose.model('productModel', productScheme);
