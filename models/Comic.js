const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const comicSchema = new Schema({
  title: String,
  year: {type:String, default:"unknown"},
  volume: String,
  issue_number: Number,
  img_icon: String,
  img_medium: String,
  id_comic: String,
  id_volume: String
});

const Comic = mongoose.model('Comic', comicSchema);
module.exports = Comic;