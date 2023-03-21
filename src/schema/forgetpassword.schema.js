const mongoose = require('mongoose');
const { Schema } = mongoose;

/* Creating a new schema for the forgetPassword collection. */
const forgetPasswordSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  code: {type: mongoose.Schema.Types.ObjectId, required: true},
  email: {type: String, require: true}
});

module.exports = mongoose.model("forgetpassword", forgetPasswordSchema);