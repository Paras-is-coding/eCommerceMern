const mongoose = require('mongoose')


const brandSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:3
    },
    slug:{
        type:String,
        unique:true,
        min:2
    },
    description:String,
    image:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"inactive"
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        default:null
    }
},{
    autoIndex:true,
    autoCreate:true,
    timestamps:true
})


const BrandModel = mongoose.model("Brand",brandSchema)
module.exports = BrandModel