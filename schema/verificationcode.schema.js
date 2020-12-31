const mongoose = require('mongoose');
const { Schema } = mongoose;

const verificationCodeSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  code: {type: mongoose.Schema.Types.ObjectId, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, require: true, ref: "User"}
});

module.exports = mongoose.model("VerificationCode", verificationCodeSchema);