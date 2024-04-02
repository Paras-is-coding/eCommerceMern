const mongoose = require('mongoose')


const categorySchema = new mongoose.Schema({
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
    },
    parentId:{
        type:mongoose.Types.ObjectId,
        ref:"Category",
        required:false,
    }
},{
    autoIndex:true,
    autoCreate:true,
    timestamps:true
})


const CategoryModel = mongoose.model("Category",categorySchema)
module.exports = CategoryModel