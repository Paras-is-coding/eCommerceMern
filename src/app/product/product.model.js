const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 2,
    },
    slug: {
      type: String,
      unique: true,
    },
    summary: String,
    description: String,
    category: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Category",
        default: null,
      },
    ],
    price: {
      type: Number,
      min: 1,
      required:true,
    },
    discount: {
      type: Number,
      min: 0,
    },
    afterDiscount: {
        type:Number,
        min:1,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: "Brand",
      default:null,
    },
    attributes: [{ key: String, value: [String]}],
    tags: [String],
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active",
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      default:null,
    },
    images: [String],
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        default:null
    }
  },
  {
    timestamps:true,
    autoCreate: true,
    autoIndex: true,
  }
);

const ProductModel = mongoose.model("Product", productSchema);
module.exports = ProductModel;
