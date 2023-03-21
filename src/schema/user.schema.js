const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Creating a schema for the user model. */
const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phone_code: {type: String, required: true},
  phone: {type: String, required: true},
  avatar: {type: String, required: false},
  social: {
    facebook: { type: String, required: false},
    twitter: { type: String, required: false},
    instagram: { type: String, required: false},
    linkedin: { type: String, required: false}
  },
  role: {type: Number, default: 2}, //admin:1, member:2
  job_title: { type: String, required: false},
  verified: {type: Boolean, default: false},
  created: {type: Date, default: Date.now, required: true},
  last_login: {type: Date, required: false}
});

module.exports = mongoose.model("user", userSchema);