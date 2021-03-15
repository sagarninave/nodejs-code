const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  username: {type: String, required: true},
  password: {type: String, required: true},
  phone: {type: String, required: true},
  avatar: {type: String, required: false},
  address: {type: String, required: false},
  gender: {type: String, required: false},
  dob: {type: Date, required: false},
  following: {type: Array, required: false},
  follower: {type: Array, required: false},
  social: {
    facebook: { type: String, required: false},
    twitter: { type: String, required: false},
    instagram: { type: String, required: false},
    linkedin: { type: String, required: false}
  },
  role: {type: Number, default: 3}, //admin:1, editor:2, viewer:3
  verified: {type: Boolean, default: false},
  created: {type: Date, default: Date.now, required: true},
  last_login: {type: Date, required: false}
});

module.exports = mongoose.model("user", userSchema);