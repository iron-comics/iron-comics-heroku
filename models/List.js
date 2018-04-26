const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const listSchema = new Schema({
  name: String,
  id_user: {type: Schema.Types.ObjectId, ref: "User"},
  id_comic: [{type: Schema.Types.ObjectId, ref: "Comic"}]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const List = mongoose.model('List', listSchema);
module.exports = List;
