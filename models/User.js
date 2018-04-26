const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname:String,
  birthday: Date,
  username: String,
  email: String,
  photo:{
    url: String,
    secure_url: String
  },
  password: String,
  isAdmin:{type:Boolean, default:false},
  list:[String]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
