const mongoose = require('mongoose');
const encryption = require('../util/encryption');
const ObjectId = mongoose.Schema.Types.ObjectId


const orderSchema = new mongoose.Schema({
    creator:{type:String},
    product:{type:ObjectId,ref:'Product'},
    dateOfOrder:{type:Date,default:Date.now()},
    toppings:[{type:String}],
    status:{type:String,default:'Pending'}
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;