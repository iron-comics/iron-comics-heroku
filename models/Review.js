const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const reviewSchema = new Schema({
  id_comic:{type: Schema.Types.ObjectId, ref: "Comic"},
  rating: Number,
  author: String,
  id_user:{type: Schema.Types.ObjectId, ref: "User"},
  reviewtext: String
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
