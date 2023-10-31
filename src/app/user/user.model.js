const mongoose = require('mongoose');


// types: String, Number, Array, Object, ObjectId, Date
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:'inactive'
    },
    image:String,
    address:{
        shipping:{
            type:String
            // state:{
            //     type:mongoose.Types.ObjectId,
            //     ref:"State"
            // },
            // district:{},
            // localBody:{},
            // wordNo:{},
            // data:{}
        },
        billing:{
            type:String
            // state:{},
            // district:{},
            // localBody:{},
            // wordNo:{},
            // data:{}
        }     
    },
    role:{
        type:String,
        enum:["admin","seller","customer"],
        default:"customer",

    },
    phone:String,
    token:String,
    resetToken:String,
    resetExpiry:Date

},
{
    // createdAt,updatedAt
    timestamps:true,

    autoCreate:true,
    autoIndex:true
})

const UserModel = mongoose.model("User",UserSchema);
module.exports = UserModel;