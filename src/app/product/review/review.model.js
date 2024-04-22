const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  }
});

const ReviewModel = mongoose.model('Review', reviewSchema);

module.exports = ReviewModel;
