const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const commentchema = new Schema({
  text: String,
  id_user: {type: Schema.Types.ObjectId, ref: "User"},
  id_review: {type: Schema.Types.ObjectId, ref: "Review"}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Commit = mongoose.model('Commit', commentchema);
module.exports = Commit;
