const mongoose = require('mongoose');
const encryption = require('../util/encryption');

const productSchema = new mongoose.Schema({
    category:{type:String},
    imageUrl:{type:String},
    size:{type:Number,required:true},
    toppings:[{type:String}]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
