const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email: {type: String, required: true, unique: true, 
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  username: {type: String, required: true},
  password: {type: String, required: true},
  phone: {type: String, required: true},
  avatar: {type: String, required: false},
  address: {type: String, required: false},
  gender: {type: String, required: false},
  dob: {type: Date, required: false},
  social: {type: Object, require: false},
  role: {type: Number, default: 3}, //admin:1, editor:2, viewer:3
  verified: {type: Boolean, default: false},
  created: {type: Date, default: Date.now, required: true},
});

module.exports = mongoose.model("User", userSchema);