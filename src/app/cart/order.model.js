const mongoose = require('mongoose')

const OrderSchema  = new mongoose.Schema({

})



const OrderModel = mongoose.model("Order",OrderSchema);
module.exports = OrderModel;