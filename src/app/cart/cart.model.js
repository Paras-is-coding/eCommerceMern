const mongoose = require('mongoose')

const CartSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Types.ObjectId,
        ref:"Order",
        default:null
    },
    productId:{
        type:mongoose.Types.ObjectId,
        ref:"Product",
        required:true
    },
    buyerId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    detail:{
        title:String,
        price:Number,
        image:String
    },
    qty:{
        type:Number,
        require:true,
        min:1
    },
    rate:{
        type:Number,
        require:true,
        min:1
    },
    amount:{
        type:Number,
        require:true,
        min:1
    },
    seller:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        default:null
        // require:true
    },
    status:{
        type:String,
        enum:['new','verified','cancelled','completed'],
        default:"new"
    }
},{
    autoCreate:true,
    timestamps:true,
    autoIndex:true
})


const CartModel = mongoose.model("Cart",CartSchema)
module.exports = CartModel;