const mongoose = require('mongoose')


const bannerSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:3
    },
    url:String,
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


const BannerModel = mongoose.model("Banner",bannerSchema)
module.exports = BannerModel