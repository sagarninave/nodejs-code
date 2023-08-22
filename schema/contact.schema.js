const mongoose = require('mongoose');
const { Schema } = mongoose;

const conatctSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  first_name: {type: String, require: true},
  last_name: {type: String, require: true},
  email: {type: String, require: true},
  phone: {type: String, require: true},
  message: {type: String, require: true}
});

module.exports = mongoose.model("contact", conatctSchema);